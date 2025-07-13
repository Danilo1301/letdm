export enum ProjectType
{
    GTASA_Mods_Mobile,
    GTASA_Mods_PC,
    Projects
}

export interface IProject
{
    name: string;
    description: string;
    image: string;
    type: ProjectType[]

    githubUrl?: string;
    videoId?: string;
    pageUrl?: string
}

export const projects: IProject[] = [
    {
        name: "GiroflexVSL",
        description: "ELM mod for GTA SA Mobile",
        image: "mods\\giroflexVSL.png",
        type: [ProjectType.GTASA_Mods_Mobile],
        githubUrl: "https://github.com/Danilo1301/GTASA_libGiroflexVSL",
        videoId: "pnYOUqGRV6Q"
    },
    {
        name: "Mod Policia",
        description: "Police mod for GTA SA Mobile",
        image: "mods\\mod-policia-android.png",
        type: [ProjectType.GTASA_Mods_Mobile],
        githubUrl: "https://github.com/Danilo1301/GTASA_libModPolicia",
        videoId: "qWYA-mso9MU"
    },
    {
        name: "Pattern Helper for Giroflex VSL",
        description: "A web page that allows you to create your own police lights for my mod called 'Giroflex VSL'",
        image: "mods\\giroflex-vsl-pattern.png",
        type: [ProjectType.GTASA_Mods_Mobile],
        videoId: "KZkaiiXhtLU"
    },
    {
        name: "Multi Remap",
        description: "A GTA San Andreas mod that allows you to change your vehicle/skin remap (or its textures)",
        image: "mods\\multi-remap-android.png",
        type: [ProjectType.GTASA_Mods_Mobile],
        githubUrl: "https://github.com/Danilo1301/GTASA_libMultiRemap",
        videoId: "PoQVXEGcZDw"
    },
    {
        name: "Menu VSL",
        description: "Create your own menu using CLEO or C++",
        image: "mods\\menu-vsl.png",
        type: [ProjectType.GTASA_Mods_Mobile],
        githubUrl: "https://github.com/Danilo1301/GTASA_libMenuVSL",
        videoId: "WHYu_alCMbU"
    },



    {
        name: "Cafemania",
        description: "Game made in Typescript using Phaser game engine",
        image: "projects\\cafemania.png",
        type: [ProjectType.Projects],
        videoId: "W2RUrSYOGoU",
        pageUrl: "https://cafemania.danilomaioli.repl.co",
        githubUrl: "https://github.com/Danilo1301/cafemania"
    },
    {
        name: "GTA for Browser",
        description: "Game made in Typescript using Phaser game engine and Three.js",
        image: "projects\\gta-browser.png",
        pageUrl: "https://game-survival.glitch.me",
        type: [ProjectType.Projects],
    },
    {
        name: "Guitar Game",
        description: "Game made in Typescript using Phaser game engine and Three.js",
        image: "projects\\guitargame.png",
        pageUrl: "https://guitargame.glitch.me",
        type: [ProjectType.Projects],
        videoId: "QoH6S8aiJg4",
        githubUrl: "https://github.com/Danilo1301/TestGame1",
    },
    {
        name: "Hello Morgan",
        description: "Game made with Scratch (2016)",
        image: "https://cdn2.scratch.mit.edu/get_image/project/131653700_144x108.png",
        pageUrl: "https://scratch.mit.edu/projects/131653700/",
        type: [ProjectType.Projects]
    },
    {
        name: "Uma Aventura no Espaço",
        description: "Game made with Scratch (2015)",
        image: "https://uploads.scratch.mit.edu/get_image/project/85648310_100x80.png",
        pageUrl: "https://scratch.mit.edu/projects/85648310/",
        type: [ProjectType.Projects]
    },
    {
        name: "Video Manager",
        description: "A NodeJS app that organizes best moments in videos",
        image: "projects\\videomanager.png",
        type: [ProjectType.Projects],
        videoId: "WlmxwY7mR3M",
        githubUrl: "https://github.com/Danilo1301/video-manager",
    },
    {
        name: "Chat",
        description: "",
        image: "projects\\chat.png",
        pageUrl: "https://dmdassc-chat1.glitch.me",
        type: [ProjectType.Projects],
    },
    {
        name: "Crab Game Server Mod",
        description: "A modification that adds commands and weapons for a game called Crab Game",
        image: "projects\\crabgame-server-mod.png",
        pageUrl: "https://www.youtube.com/watch?v=UNDTeMtOLVY",
        type: [ProjectType.Projects],
        videoId: "UNDTeMtOLVY",
        githubUrl: "https://github.com/Danilo1301/crab-game-server-mod"
    },
    {
        name: "Youtube Playlist Check",
        description: "",
        image: "projects\\github-project.png",
        type: [ProjectType.Projects],
        githubUrl: "https://github.com/Danilo1301/youtube-playlist-check",
    },
    {
        name: "Dorime Multiplayer",
        description: "Game in Scratch (2020)",
        image: "https://cdn2.scratch.mit.edu/get_image/project/370860246_100x80.png",
        pageUrl: "https://scratch.mit.edu/projects/370860246/",
        type: [ProjectType.Projects],
    },
    {
        name: "Desvie (Webcam)",
        description: "Game in Scratch (2020)",
        image: "https://cdn2.scratch.mit.edu/get_image/project/467722147_100x80.png",
        pageUrl: "https://scratch.mit.edu/projects/467722147/",
        type: [ProjectType.Projects],
    },
]


/*
{
    title: "Giroflex VSL (PC)",
    shortDescription: "",
    description: "",
    image: "assets/thumbs/vehicle-siren-lights.png",
    pageUrl: "https://www.youtube.com/watch?v=sTG_e6sXQD4",
    categories: [HomepageItemCategory.GTA_SA_MODS],
    videoPreviewId: "sTG_e6sXQD4",
    githubUrl: "https://github.com/Danilo1301/vehicle-siren-lights-v2",
    openNewPage: true,
    gtaModType: GTAModType.PC
},
{
    title: "Neon Lights",
    shortDescription: "",
    description: "",
    image: "assets/thumbs/neon-lights.png",
    pageUrl: undefined,
    openNewPage: true,
    categories: [HomepageItemCategory.GTA_SA_MODS],
    videoPreviewId: "nFGJpmpwkhY",
    gtaModType: GTAModType.PC
},
{
    title: "Hydra Missile",
    shortDescription: "",
    description: "",
    image: "assets/thumbs/hydra-missile.png",
    categories: [HomepageItemCategory.GTA_SA_MODS],
    videoPreviewId: "VDC6f95FV8w",
    githubUrl: "https://github.com/Danilo1301/hydra-missile",
    openNewPage: true,
    gtaModType: GTAModType.PC
},
{
    title: "Hydra Thrust",
    shortDescription: "",
    description: "",
    image: "assets/thumbs/unknown-project.png",
    categories: [HomepageItemCategory.GTA_SA_MODS],
    githubUrl: "https://github.com/Danilo1301/hydra-thrust",
    openNewPage: true,
    gtaModType: GTAModType.PC
},
{
    title: "Multi Siren",
    shortDescription: "",
    description: "",
    image: "assets/thumbs/unknown-project.png",
    categories: [HomepageItemCategory.GTA_SA_MODS],
    githubUrl: "https://github.com/Danilo1301/multi-siren",
    openNewPage: true,
    gtaModType: GTAModType.PC
},
{
    title: "NSiren (old)",
    shortDescription: "",
    description: "",
    image: "assets/thumbs/unknown-project.png",
    pageUrl: undefined,
    categories: [HomepageItemCategory.GTA_SA_MODS],
    videoPreviewId: undefined,
    githubUrl: "https://github.com/Danilo1301/Nsiren",
    openNewPage: true,
    hidden: false,
    gtaModType: GTAModType.PC
},
{
    title: "Animelist",
    shortDescription: "A site that organizes a list of animes",
    description: "",
    image: "assets/thumbs/animelist.png",
    pageUrl: "https://letdm-animelist.glitch.me",
    categories: [HomepageItemCategory.PRINCIPAL, HomepageItemCategory.PROJECTS],
    githubUrl: "https://github.com/Danilo1301/animelist",
    openNewPage: true
},
{
    title: "Vilubri",
    shortDescription: "",
    description: "",
    image: "assets/thumbs/vilubri.png",
    pageUrl: "https://vilubri.glitch.me/",
    categories: [HomepageItemCategory.MAIN_PROJECTS, HomepageItemCategory.PRINCIPAL, HomepageItemCategory.PROJECTS],
    githubUrl: "https://github.com/Danilo1301/vilubri",
    openNewPage: true
},
*/