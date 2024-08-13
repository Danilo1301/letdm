import React, { createContext, useContext, useEffect, useState } from "react";
import { Tag, TagsContext } from "../Suggestions";
import { suggestionPriorityTags, suggestionTags } from "../../../../../src/suggestions/suggestion";

export interface SuggestionInfo {
    title: string
    content: string
    username: string
    tags: string[]
    priorityTags: string[]
}
  
export interface SuggestionInfoContextType {
    suggestionInfo: SuggestionInfo;
    setSuggestionInfo: (newUserInfo: Partial<SuggestionInfo>) => void;
}

export const defaultSuggestionInfo: SuggestionInfo = {
    title: "",
    content: "",
    username: "",
    tags: [],
    priorityTags: []
}

export const SuggestionInfoContext = createContext<SuggestionInfoContextType>({
    suggestionInfo: defaultSuggestionInfo,
    setSuggestionInfo: () => {},
});

interface EditSuggestionModelProps {
    onSave?: Function
    onDelete?: Function
}

export const EditSuggestionModel: React.FC<EditSuggestionModelProps> = ({onSave, onDelete}) => {

    const { suggestionInfo, setSuggestionInfo } = useContext(SuggestionInfoContext);

    const [tagsId_sugestionType, setTagsId_sugestionType] = useState<string[]>(suggestionTags);
    const [tagsId_priority, setTagsId_priority] = useState<string[]>(suggestionPriorityTags);

    const updateTags_suggestionType = (tags: string[]) => {
        setSuggestionInfo({tags: tags});
    }

    const updateTags_priority = (tags: string[]) => {
        setSuggestionInfo({priorityTags: tags});
    }

    const handleSave = () => {
        onSave?.();
    };
    
    const handleDelete = () => {
        onDelete?.();
    };
    
    return (
        <>
            <div>
                <div className='mt-4'>
                    <span>Title:</span>
                    <input type="text" className="form-control" placeholder="Title" onChange={e => { setSuggestionInfo({title: e.target.value}) }} value={suggestionInfo.title}></input>
                </div>

                <div className='mt-4'>
                    <span>Username:</span>
                    <input type="text" className="form-control" placeholder="Username" onChange={e => { setSuggestionInfo({username: e.target.value}) }} value={suggestionInfo.username}></input>
                </div>

                <div className='mt-4'>
                    <TagsContext.Provider value={{ tags: suggestionInfo.tags, setTags: updateTags_suggestionType }}>
                        <span>Tags - Tipo de sugestão</span>
                        <span>( {suggestionInfo.tags} )</span>

                        { tagsId_sugestionType.map(id => <Tag key={id} name={id}></Tag>) }
                    </TagsContext.Provider>
                </div>

                <div className='mt-4'>
                    <TagsContext.Provider value={{ tags: suggestionInfo.priorityTags, setTags: updateTags_priority }}>
                        <span>Tags - Prioridade</span>
                        <span>( {suggestionInfo.priorityTags} )</span>

                        { tagsId_priority.map(id => <Tag key={id} name={id}></Tag>) }
                    </TagsContext.Provider>
                </div>

                <div className='mt-4'>
                    <div>tags: {suggestionInfo.tags}</div>
                    <div>priorityTags: {suggestionInfo.priorityTags}</div>
                </div>

                <div className='mt-4'>
                    <span>Content:</span>
                    <input type="text" className="form-control" placeholder="Content" onChange={e => { setSuggestionInfo({content: e.target.value}) }} value={suggestionInfo.content}></input>
                </div>
                
                <div className='row mt-4 mb-4'>
                    <div className='col d-grid'>
                        <button type="button" className="btn btn-primary" onClick={handleSave}>Save</button>
                    </div>
                    <div className='col'>
                    <button type="button" className="btn btn-danger" onClick={handleDelete}>Delete</button>
                    </div>
                </div>
            </div>
        </>
    );
}