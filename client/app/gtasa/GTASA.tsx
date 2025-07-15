import React from 'react';
import { HomeItem } from '../home/Home';
import Divider from '../components/Divider';

function GTASA() {

    return (
        <>
            <div className="container mt-4">
                
                <div className="back">
                    <a href="/">Back</a>
                </div>

                <div>
                    <HomeItem
                        title={'GTA Mods (Android)'}
                        description={'GTA SA mods for mobile'}
                        image={'assets\\projectThumbs\\gtasa_mods_mobile.png'}
                        href='/gtasa/mobile/mods'
                    ></HomeItem>

                    <Divider></Divider>

                    <HomeItem
                        title={'GTA Mods (PC)'}
                        description={'GTA SA mods for mobile'}
                        image={'assets\\projectThumbs\\gtasa_mods_pc.png'}
                        href='/gtasa/pc/mods'
                    ></HomeItem>

                    <Divider></Divider>

                    <HomeItem
                        title={'Pattern helper'}
                        description={'Pattern helper for GTA SA mod called GiroflexVSL'}
                        image={'assets\\projectThumbs\\projects.png'}
                        href='/gtasa/patterns'
                    ></HomeItem>
                </div>
            </div>
        </>
    );
}

export default GTASA;