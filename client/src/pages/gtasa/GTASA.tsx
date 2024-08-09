import React from 'react';
import { ListItemGroup } from '../../components/list/ListItemGroup';
import { ListItem } from '../../components/list/ListItem';
import { ListItemModal } from '../../components/list/ListItemModal';

function GTASA() {

    return (
        <>
            <div className="container mt-4">
                
                <div className="back">
                    <a href="/">Back</a>
                </div>

                <ListItemGroup title="GTA SA">
                    <ListItem title="Mods Android" href="/gtasa/mods/android" description=""></ListItem>
                    <ListItem title="Mods PC" href="/gtasa/mods/pc" description=""></ListItem>
                    <ListItem title="Suggestions" description="Add/view mods suggestions"></ListItem>
                    <ListItem image="assets/giroflex_e_leds.png" title="Lighbars and LEDs" href="https://gtasa-files.glitch.me" description="Download .dff models for GTA SA"></ListItem>
                </ListItemGroup>
            </div>
        </>
    );
}

export default GTASA;