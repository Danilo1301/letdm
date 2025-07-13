import React, { useState } from 'react';
import { HomepageItemCardList } from './components/HomepageItemCardList';
import { HomepageItem, HomepageItemCategory } from './HomepageItem';
import { LucideDivideSquare } from 'lucide-react';
import Divider from '../components/Divider';
import ProjectWindow from '../components/project/ProjectModal';

/*
<HomepageItemCardList title="Main Projects" category={HomepageItemCategory.PRINCIPAL}></HomepageItemCardList>
<HomepageItemCardList title="Games" category={HomepageItemCategory.GAMES}></HomepageItemCardList>
<HomepageItemCardList title="Projects" category={HomepageItemCategory.PROJECTS}></HomepageItemCardList>
<HomepageItemCardList title="GTA SA Mods" category={HomepageItemCategory.GTA_SA_MODS}></HomepageItemCardList>
<HomepageItemCardList title="Scratch" category={HomepageItemCategory.SCRATCH}></HomepageItemCardList>
*/

function Home() {

    return (
        <>
            <div className='container p-2'>
                <HomeItem
                    title={'FZone'}
                    description={'PC/Mobile game'}
                    image={'assets\\projectThumbs\\fzone.png'}
                ></HomeItem>

                <Divider></Divider>

                <HomeItem
                    title={'GTA San Andreas'}
                    description={'Mods or other stuff'}
                    image={'assets\\projectThumbs\\gtasa_mods_pc.png'}
                    href='/gtasa'
                ></HomeItem>

                <Divider></Divider>

                <HomeItem
                    title={'Github'}
                    description={'Github page'}
                    image={'assets\\projectThumbs\\github.png'}
                    href='http://github.com/Danilo1301'
                ></HomeItem>

                <Divider></Divider>

                <HomeItem
                    title={'Projetos'}
                    description={'Projetos'}
                    image={'assets\\projectThumbs\\projects.png'}
                    href='/projects'
                ></HomeItem>

                <Divider></Divider>

                <HomeItem
                    title={'Vilubri'}
                    description={'Descrição'}
                    image={'assets\\projectThumbs\\vilubri.png'}
                    href='/vilubri'
                ></HomeItem>
            </div>
        </>
    );
}

export interface HomeItemProps {
  // suas props aqui
  title: string;
  description: string;
  image: string
  href?: string
}

export const HomeItem: React.FC<HomeItemProps> = (props) => {

    const handleClick = () => {

        if(props.href != undefined)
        {
            location.href = props.href;
        }
    }

    return (
        <>
        <div onClick={handleClick} className='home_item' style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <img
                src={props.image}
                alt="imagem"
                style={{ width: '80px', height: '80px', borderRadius: '8px' }}
            />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <h4 style={{ margin: 0 }}>{props.title}</h4>
                <p style={{ margin: 0, color: '#666' }}>{props.description}</p>
            </div>
        </div>
        </>
    );
};


export default Home;