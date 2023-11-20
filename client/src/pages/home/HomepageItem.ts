export enum HomepageItemCategory {
    GAMES,
    PROJECTS,
    SCRATCH,
    GTA_SA_MODS,
    PRINCIPAL
}
    
export interface HomepageItem {
    title: string
    shortDescription: string
    description: string
    image: string
    pageUrl?: string
    categories: HomepageItemCategory[]
    videoPreviewId?: string
    githubUrl?: string
    hidden?: boolean
}