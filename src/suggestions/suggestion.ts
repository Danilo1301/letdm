export interface Suggestion {
    id: string
    title: string
    username: string
    content: string
    tags: string[]
    priorityTags: string[]
    dateAdded: number
}

export const suggestionTags: string[] = [
    "Mod Policia",
    "Mod Giroflex",
    "Mod MultiRemap",
    "Mod MenuVSL",
    "Mod MultiSiren",
    "Other mod",
    "New mod"
];
export const suggestionPriorityTags: string[] = [
    "High priority",
    "Normal suggestion",
    "Low priority",
    "On-going",
    "Completed",
];