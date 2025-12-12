import { useQuery } from "@tanstack/react-query";
import { FishSpecies } from "@/data/freshwater-fish";

async function fetchFishData(): Promise<FishSpecies[]> {
    const response = await fetch("/api/fish");
    if (!response.ok) {
        throw new Error("Failed to fetch fish data");
    }
    return response.json();
}

export function useFishData() {
    return useQuery<FishSpecies[]>({
        queryKey: ["/api/fish"],
        queryFn: fetchFishData,
    });
}

async function fetchFishSpecies(id: string): Promise<FishSpecies> {
    const response = await fetch(`/api/fish/${id}`);
    if (!response.ok) {
        throw new Error("Failed to fetch fish species");
    }
    return response.json();
}

export function useFishSpecies(id: string) {
    return useQuery<FishSpecies>({
        queryKey: [`/api/fish/${id}`],
        queryFn: () => fetchFishSpecies(id),
        enabled: !!id,
    });
}
