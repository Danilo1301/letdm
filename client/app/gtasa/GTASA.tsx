import React from 'react';
import { ListItemGroup } from '../components/list/ListItemGroup';
import { ListItem } from '../components/list/ListItem';

function GTASA() {

    return (
        <>
            <div className="container mt-4">
                
                <div className="back">
                    <a href="/">Back</a>
                </div>

                <ListItemGroup title="GTA SA">
                    <ListItem title="Mods Android" href="/gtasa/mods/android" selectable={true} description=""></ListItem>
                    <ListItem title="Mods PC" href="/gtasa/mods/pc" selectable={true} description=""></ListItem>
                    <ListItem title="Suggestions" href="/suggestions" selectable={true} description="Add/view mods suggestions"></ListItem>
                    <ListItem image="assets/giroflex_e_leds.png" title="Lighbars and LEDs" href="https://gtasa-files.glitch.me" selectable={true} description="Download .dff models for GTA SA"></ListItem>
                </ListItemGroup>
            </div>
        </>
    );
}

export default GTASA;