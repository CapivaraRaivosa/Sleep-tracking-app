import { useState } from "react";
import { Text, View, ScrollView, Pressable, Platform, Alert } from "react-native";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system/legacy";
import * as Haptics from "expo-haptics";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useSleepStorage } from "@/hooks/use-sleep-storage";
import { useStats } from "@/hooks/use-stats";
import { StatsPeriod } from "@/types/sleep";

/**
 * Tela de Estatísticas - Análise de Dados de Sono
 */
export default function StatsScreen() {
  const colors = useColors();
  const { records, isLoading } = useSleepStorage();
  const [selectedPeriod, setSelectedPeriod] = useState<StatsPeriod>("7d");
  const stats = useStats(records, selectedPeriod);

  const periods: { value: StatsPeriod; label: string }[] = [
    { value: "24h", label: "24h" },
    { value: "3d", label: "3 dias" },
    { value: "7d", label: "7 dias" },
    { value: "30d", label: "30 dias" },
  ];

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}min`;
    }
    return `${mins}min`;
  };

  const exportToCSV = async () => {
    if (records.length === 0) {
      Alert.alert("Sem Dados", "Não há registros para exportar.");
      return;
    }

    if (Platform.OS !== "web") {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    try {
      // Gerar CSV
      const header = "Data Início,Hora Início,Data Fim,Hora Fim,Duração (minutos)\n";
      const rows = records
        .map((record) => {
          const start = new Date(record.startTime);
          const end = new Date(record.endTime);
          return [
            start.toLocaleDateString("pt-BR"),
            start.toLocaleTimeString("pt-BR"),
            end.toLocaleDateString("pt-BR"),
            end.toLocaleTimeString("pt-BR"),
            record.durationMinutes.toString(),
          ].join(",");
        })
        .join("\n");

      const csv = header + rows;

      // Salvar arquivo
      const fileName = `sleeptracker_${new Date().toISOString().split("T")[0]}.csv`;
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;

      await FileSystem.writeAsStringAsync(fileUri, csv, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      // Compartilhar arquivo
      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(fileUri, {
          mimeType: "text/csv",
          dialogTitle: "Exportar Dados de Sono",
        });

        if (Platform.OS !== "web") {
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
      } else {
        Alert.alert("Sucesso", `Arquivo salvo em: ${fileUri}`);
      }
    } catch (error) {
      console.error("Erro ao exportar CSV:", error);
      Alert.alert("Erro", "Não foi possível exportar os dados.");
    }
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
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="gap-6">
          {/* Cabeçalho */}
          <View>
            <Text className="text-3xl font-bold text-foreground">Estatísticas</Text>
            <Text className="text-base text-muted mt-1">
              Análise dos seus padrões de sono
            </Text>
          </View>

          {/* Seletor de Período */}
          <View>
            <Text className="text-sm font-semibold text-muted mb-3">Período</Text>
            <View className="flex-row gap-2">
              {periods.map((period) => (
                <Pressable
                  key={period.value}
                  onPress={() => setSelectedPeriod(period.value)}
                  style={({ pressed }) => [
                    {
                      flex: 1,
                      paddingVertical: 12,
                      paddingHorizontal: 16,
                      borderRadius: 8,
                      backgroundColor:
                        selectedPeriod === period.value ? colors.primary : colors.surface,
                      borderWidth: 1,
                      borderColor:
                        selectedPeriod === period.value ? colors.primary : colors.border,
                      opacity: pressed ? 0.7 : 1,
                    },
                  ]}
                >
                  <Text
                    className="text-center font-semibold"
                    style={{
                      color: selectedPeriod === period.value ? "#FFFFFF" : colors.foreground,
                    }}
                  >
                    {period.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Cards de Estatísticas */}
          <View className="gap-3">
            {/* Total de Horas */}
            <View className="bg-surface rounded-xl p-4 border border-border">
              <Text className="text-sm font-semibold text-muted mb-1">
                Total de Horas Dormidas
              </Text>
              <Text className="text-3xl font-bold text-primary">
                {stats.totalHours.toFixed(1)}h
              </Text>
            </View>

            {/* Média por Dia */}
            <View className="bg-surface rounded-xl p-4 border border-border">
              <Text className="text-sm font-semibold text-muted mb-1">
                Média por Dia
              </Text>
              <Text className="text-3xl font-bold text-foreground">
                {stats.averageHours.toFixed(1)}h
              </Text>
            </View>

            {/* Número de Registros */}
            <View className="bg-surface rounded-xl p-4 border border-border">
              <Text className="text-sm font-semibold text-muted mb-1">
                Número de Registros
              </Text>
              <Text className="text-3xl font-bold text-foreground">
                {stats.recordCount}
              </Text>
            </View>

            {/* Maior e Menor Duração */}
            {stats.recordCount > 0 && (
              <View className="flex-row gap-3">
                <View className="flex-1 bg-surface rounded-xl p-4 border border-border">
                  <Text className="text-sm font-semibold text-muted mb-1">
                    Maior Duração
                  </Text>
                  <Text className="text-2xl font-bold text-success">
                    {formatDuration(stats.maxDuration)}
                  </Text>
                </View>
                <View className="flex-1 bg-surface rounded-xl p-4 border border-border">
                  <Text className="text-sm font-semibold text-muted mb-1">
                    Menor Duração
                  </Text>
                  <Text className="text-2xl font-bold text-warning">
                    {formatDuration(stats.minDuration)}
                  </Text>
                </View>
              </View>
            )}
          </View>

          {/* Botão de Exportar CSV */}
          <Pressable
            onPress={exportToCSV}
            style={({ pressed }) => [
              {
                backgroundColor: colors.primary,
                paddingVertical: 16,
                paddingHorizontal: 24,
                borderRadius: 12,
                alignItems: "center",
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <Text className="text-white text-lg font-bold">
              Exportar Dados em CSV
            </Text>
          </Pressable>

          {/* Mensagem se não houver dados */}
          {stats.recordCount === 0 && (
            <View className="items-center py-8">
              <Text className="text-base text-muted text-center">
                Nenhum registro no período selecionado.{"\n"}
                Tente selecionar um período maior.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
