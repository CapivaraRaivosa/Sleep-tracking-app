import { useState, useEffect } from "react";
import { Text, View, Pressable, Platform } from "react-native";
import * as Haptics from "expo-haptics";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { useSleepStorage } from "@/hooks/use-sleep-storage";

/**
 * Tela Principal - Registro de Sono
 * 
 * Exibe data/hora atual, status do sono e botão central para registrar sono
 */
export default function HomeScreen() {
  const colors = useColors();
  const { sleepState, startSleep, endSleep, records, isLoading } = useSleepStorage();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [elapsedTime, setElapsedTime] = useState(0);

  // Atualizar hora atual a cada segundo
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Calcular tempo decorrido se estiver dormindo
  useEffect(() => {
    if (sleepState.isSleeping && sleepState.currentSleepStart) {
      const timer = setInterval(() => {
        const start = new Date(sleepState.currentSleepStart!);
        const now = new Date();
        const elapsed = Math.floor((now.getTime() - start.getTime()) / 1000);
        setElapsedTime(elapsed);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [sleepState.isSleeping, sleepState.currentSleepStart]);

  const handleSleepToggle = async () => {
    // Feedback háptico
    if (Platform.OS !== "web") {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    try {
      if (sleepState.isSleeping) {
        await endSleep();
      } else {
        await startSleep();
      }
    } catch (error) {
      console.error("Erro ao alternar sono:", error);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const formatElapsedTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}min`;
    }
    return `${mins}min`;
  };

  const lastRecord = records.length > 0 ? records[0] : null;

  if (isLoading) {
    return (
      <ScreenContainer className="items-center justify-center">
        <Text className="text-lg text-muted">Carregando...</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="px-6 py-8">
      <View className="flex-1 gap-8">
        {/* Data e Hora Atual */}
        <View className="items-center gap-2">
          <Text className="text-5xl font-bold text-foreground">
            {formatTime(currentTime)}
          </Text>
          <Text className="text-base text-muted capitalize">
            {formatDate(currentTime)}
          </Text>
        </View>

        {/* Status do Sono */}
        <View className="items-center gap-2">
          <Text className="text-xl font-semibold text-foreground">
            {sleepState.isSleeping ? "Dormindo..." : "Acordado"}
          </Text>
          {sleepState.isSleeping && (
            <Text className="text-lg text-muted">
              Tempo decorrido: {formatElapsedTime(elapsedTime)}
            </Text>
          )}
        </View>

        {/* Botão Central Grande */}
        <View className="flex-1 items-center justify-center">
          <Pressable
            onPress={handleSleepToggle}
            style={({ pressed }) => [
              {
                width: 200,
                height: 200,
                borderRadius: 100,
                backgroundColor: sleepState.isSleeping ? "#F59E0B" : colors.primary,
                justifyContent: "center",
                alignItems: "center",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 8,
                transform: [{ scale: pressed ? 0.97 : 1 }],
              },
            ]}
          >
            <IconSymbol
              name={sleepState.isSleeping ? "sun.max.fill" : "moon.fill"}
              size={80}
              color="#FFFFFF"
            />
            <Text className="text-white text-xl font-bold mt-2">
              {sleepState.isSleeping ? "Acordar" : "Dormir"}
            </Text>
          </Pressable>
        </View>

        {/* Último Registro */}
        {lastRecord && (
          <View className="bg-surface rounded-2xl p-4 border border-border">
            <Text className="text-sm font-semibold text-muted mb-2">
              Último Registro
            </Text>
            <Text className="text-base text-foreground">
              Dormiu {new Date(lastRecord.startTime).toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
              })}{" "}
              ({new Date(lastRecord.startTime).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
              })})
              {" — "}
              Acordou {new Date(lastRecord.endTime).toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
              })}{" "}
              ({new Date(lastRecord.endTime).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
              })})
            </Text>
            <Text className="text-lg font-bold text-primary mt-1">
              Total: {formatDuration(lastRecord.durationMinutes)}
            </Text>
          </View>
        )}
      </View>
    </ScreenContainer>
  );
}
