import React, { createContext, useContext, useEffect, useState } from 'react';
import { ListItemGroup } from '../../components/list/ListItemGroup';
import { ListItem } from '../../components/list/ListItem';
import { UserInfoContext } from '../../components/UserInfo';
import { Suggestion, suggestionPriorityTags, suggestionTags } from '../../../../src/suggestions/suggestion';

export interface TagsContextType {
    tags: string[];
    setTags: (tags: string[]) => void;
}

export const TagsContext = createContext<TagsContextType>({
    tags: [],
    setTags: (tags: string[]) => {},
});

export interface TagProps {
    name: string
}

export const Tag: React.FC<TagProps> = ({name}) =>
{
    const [enabled, setEnabled] = React.useState(false);
    const { tags, setTags } = useContext(TagsContext);
    
    const onClick = () => {

        console.log("set tags")

        if(tags.includes(name))
        {
            setTags(tags.filter(tag => tag !== name));
        } else {
            setTags([...tags, name]);
        }
    };

    useEffect(() => {
        if(tags.includes(name))
        {
            setEnabled(true);
        } else {
            setEnabled(false);
        }
    }, [tags]);
    
    let enabledTag = enabled ? "enabled" : "";

    return (
        <>
            <div className={"suggestion-tag " + enabledTag} onClick={onClick}>
                {name}
            </div>
        </>
    );
}

interface SuggestionElementProps {
    suggestion: Suggestion
}

const SuggestionElement: React.FC<SuggestionElementProps> = ({suggestion}) => {

    const { userInfo } = useContext(UserInfoContext);

    const id = suggestion.id;

    const edit = () => {
        location.href = `/suggestions/${id}/edit`;
    };

    let editBtnEl = <></>;

    if(userInfo.isAdmin)
    {
        editBtnEl = <button onClick={edit}>Editar</button>;
    }

    var d = new Date(suggestion.dateAdded);
    let dateTime = d.toLocaleString('pt-BR', {});

    return (
        <>
            <ListItem title={suggestion.title} description="">
                <div>Postado por: {suggestion.username} | {dateTime}</div>
                <div>{suggestion.content}</div>
                <div>{suggestion.tags}</div>
                <div>{suggestion.priorityTags}</div>
                {editBtnEl}
            </ListItem>
        </>
    );
};

const Suggestions: React.FC = () => {

    const { userInfo } = useContext(UserInfoContext);

    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

    const [tagsId_sugestionType, setTagsId_sugestionType] = useState<string[]>(suggestionTags);
    const [tagsId_priority, setTagsId_priority] = useState<string[]>(suggestionPriorityTags);

    const [tags_suggestionType, setTags_suggestionType] = useState<string[]>([]);
    const [tags_priority, setTags_priority] = useState<string[]>([]);

    useEffect(() => {
        fetch("/api/suggestions", {method: 'GET'})
            .then(response => response.json())
            .then((suggestions: Suggestion[]) => {
                console.log("suggestions", suggestions);

                setSuggestions(suggestions);
            })
            .catch((err) => {
            
            });
    }, []);

    let organizedSuggestions = suggestions.sort((a, b) => {
        return b.dateAdded - a.dateAdded;
    });

    organizedSuggestions = organizedSuggestions.filter(suggestion => {

        if(tags_suggestionType.length > 0)
        {
            for(const tag of tags_suggestionType)
            {
                if(suggestion.tags.includes(tag))
                {
                    if(tags_priority.length > 0)
                    {
                        for(const tag of tags_priority)
                        {
                            if(suggestion.priorityTags.includes(tag)) return true;
                        }
                        return false;
                    }
                        
                    return true;
                }
            }

            return false;
        }

        return true;
    });

    let newSuggestionBtnEl = <></>;
    //if(userInfo.isAdmin) newSuggestionBtnEl = <button onClick={newSuggestion}>Nova sugestão</button>;

    return (
        <>
            <div className="container mt-4">
                
                <div className="back">
                    <a href="/gtasa">Back</a>
                </div>

                <ListItemGroup title="Suggestions">
                    <ListItem title="Opções" description="">
                        <TagsContext.Provider value={{ tags: tags_suggestionType, setTags: setTags_suggestionType }}>
                            <span>Tags - Tipo de sugestão</span>
                            <span>( {tags_suggestionType} )</span>

                            { tagsId_sugestionType.map(id => <Tag key={id} name={id}></Tag>) }
                        </TagsContext.Provider>
                        <TagsContext.Provider value={{ tags: tags_priority, setTags: setTags_priority }}>
                            <span>Tags - Prioridade</span>
                            <span>( {tags_priority} )</span>
                            { tagsId_priority.map(id => <Tag key={id} name={id}></Tag>) }
                        </TagsContext.Provider>
                    </ListItem>

                    <div>
                        <button onClick={() => { location.href = "/suggestions/new"; }}>Nova sugestão</button>
                        <button onClick={() => { location.href = "/suggestions/data"; }}>Data</button>
                        <button onClick={() => { location.href = "/key"; }}>Key</button>
                    </div>
                    {newSuggestionBtnEl}

                    {organizedSuggestions.map((suggestion, index) => <SuggestionElement key={index} suggestion={suggestion}></SuggestionElement>)}
                </ListItemGroup>
            </div>
        </>
    );
}

export default Suggestions;