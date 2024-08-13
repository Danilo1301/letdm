import { Suggestion } from "./suggestions/suggestion"

export interface RetrieveUserInfo_PostBody {
    sub?: string
}

export interface RetrieveUserInfo_Response {
    isAdmin: boolean
}

export interface NewSugestion_PostBody {
    suggestion: Suggestion
    sub?: string
    key: string
}

export interface Key_PostBody {
    key: string
}