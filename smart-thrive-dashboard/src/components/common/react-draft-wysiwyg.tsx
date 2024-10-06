import { ContentState, convertFromRaw, convertToRaw, EditorState } from 'draft-js';
import { useState } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import NeuButton from './neu-button';

interface RichEditorProps {
    description: string;
    onChange: (value: string) => void; // Nhận hàm onChange từ FormField
}

const RichEditor: React.FC<RichEditorProps> = ({ description, onChange }: RichEditorProps) => {
    const [editorState, setEditorState] = useState(() => {
        try {
            const contentState = description
                ? convertFromRaw(JSON.parse(description))
                : ContentState.createFromText("");
            return EditorState.createWithContent(contentState);
        } catch (error) {
            return EditorState.createWithContent(ContentState.createFromText(""));
        }
    });

    const handleEditorStateChange = (newEditorState: EditorState) => {
        setEditorState(newEditorState);
        const content = JSON.stringify(convertToRaw(newEditorState.getCurrentContent()));
        onChange(content); // Gọi onChange khi editor thay đổi
    };

    return (
        <div className="App p-4">
            {/* <header className="App-header flex justify-between pb-1">
                Content
                <NeuButton>Save Changes</NeuButton>
            </header> */}
            <Editor
                editorState={editorState}
                onEditorStateChange={handleEditorStateChange} // Sử dụng hàm mới
                wrapperClassName="wrapper-class"
                editorClassName="editor-class"
                toolbarClassName="toolbar-class"
            />
        </div>
    );
};

export default RichEditor;
