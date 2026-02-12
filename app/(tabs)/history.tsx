import { useState } from "react";
import { Text, View, FlatList, Pressable, Alert, Platform } from "react-native";
import * as Haptics from "expo-haptics";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { useSleepStorage } from "@/hooks/use-sleep-storage";
import { SleepRecord } from "@/types/sleep";

/**
 * Tela de Histórico - Lista de Registros de Sono
 */
export default function HistoryScreen() {
  const colors = useColors();
  const { records, deleteRecord, isLoading } = useSleepStorage();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);
    return {
      time: date.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      date: date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
      }),
    };
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}min`;
    }
    return `${mins}min`;
  };

  const handleDelete = async (id: string) => {
    if (Platform.OS !== "web") {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }

    Alert.alert(
      "Excluir Registro",
      "Tem certeza que deseja excluir este registro de sono?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteRecord(id);
              if (Platform.OS !== "web") {
                await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              }
            } catch (error) {
              console.error("Erro ao excluir registro:", error);
              Alert.alert("Erro", "Não foi possível excluir o registro.");
            }
          },
        },
      ]
    );
  };

  const toggleExpanded = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const renderItem = ({ item }: { item: SleepRecord }) => {
    const start = formatDateTime(item.startTime);
    const end = formatDateTime(item.endTime);
    const isExpanded = expandedId === item.id;

    return (
      <Pressable
        onPress={() => toggleExpanded(item.id)}
        style={({ pressed }) => [
          {
            opacity: pressed ? 0.7 : 1,
          },
        ]}
      >
        <View className="bg-surface rounded-xl p-4 mb-3 border border-border">
          {/* Informação Principal */}
          <Text className="text-base text-foreground leading-relaxed">
            Dormiu <Text className="font-semibold">{start.time}</Text> ({start.date})
            {" — "}
            Acordou <Text className="font-semibold">{end.time}</Text> ({end.date})
          </Text>
          <Text className="text-lg font-bold text-primary mt-2">
            Total: {formatDuration(item.durationMinutes)}
          </Text>

          {/* Ações (quando expandido) */}
          {isExpanded && (
            <View className="flex-row gap-3 mt-4 pt-4 border-t border-border">
              <Pressable
                onPress={() => handleDelete(item.id)}
                style={({ pressed }) => [
                  {
                    flex: 1,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: colors.error,
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                    borderRadius: 8,
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}
              >
                <IconSymbol name="trash" size={20} color="#FFFFFF" />
                <Text className="text-white font-semibold ml-2">Excluir</Text>
              </Pressable>
            </View>
          )}
        </View>
      </Pressable>
    );
  };

  if (isLoading) {
    return (
      <ScreenContainer className="items-center justify-center">
        <Text className="text-lg text-muted">Carregando...</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="px-6 py-8">
      <View className="flex-1">
        {/* Cabeçalho */}
        <View className="mb-6">
          <Text className="text-3xl font-bold text-foreground">Histórico</Text>
          <Text className="text-base text-muted mt-1">
            {records.length} {records.length === 1 ? "registro" : "registros"}
          </Text>
        </View>

        {/* Lista de Registros */}
        {records.length === 0 ? (
          <View className="flex-1 items-center justify-center">
            <IconSymbol name="moon.fill" size={64} color={colors.muted} />
            <Text className="text-lg text-muted mt-4 text-center">
              Nenhum registro ainda.{"\n"}
              Comece registrando seu sono na tela Home.
            </Text>
          </View>
        ) : (
          <FlatList
            data={records}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 16 }}
          />
        )}
      </View>
    </ScreenContainer>
  );
}
