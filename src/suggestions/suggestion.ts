export interface Suggestion {
    title: string
    username: string
    content: string
    tags: string[]
    priorityTags: string[]
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
    "Completed",
    "High priority",
    "Normal suggestion",
    "Low priority"
];