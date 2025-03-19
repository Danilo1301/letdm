export interface ThemeJSON
{
    navColor: string;
    dateColor: string;
    backgroundColor: string;
    itemColor: string;
}

export interface Theme
{
    id: string
    data: ThemeJSON;
}