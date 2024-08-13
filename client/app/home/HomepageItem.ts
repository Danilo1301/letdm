export enum HomepageItemCategory {
    MAIN_PROJECTS,
    GAMES,
    PROJECTS,
    SCRATCH,
    GTA_SA_MODS,
    PRINCIPAL
}

export enum GTAModType {
    ANDROID,
    PC,
    BOTH
}

export interface HomepageItem {
    title: string
    shortDescription: string
    description: string
    image: string
    pageUrl?: string
    openNewPage: boolean
    categories: HomepageItemCategory[]
    videoPreviewId?: string
    githubUrl?: string
    hidden?: boolean
    gtaModType?: GTAModType
}