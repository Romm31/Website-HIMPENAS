declare module 'react-quill' {
  import { Component } from 'react';
  
  export interface QuillOptions {
    debug?: string | boolean;
    modules?: any;
    formats?: string[];
    theme?: string;
    [key: string]: any;
  }
  
  export interface ReactQuillProps {
    value?: string | any;
    defaultValue?: string | any;
    placeholder?: string;
    readOnly?: boolean;
    modules?: any;
    formats?: string[];
    theme?: string;
    onChange?: (content: string, delta: any, source: any, editor: any) => void;
    onChangeSelection?: (range: any, source: any, editor: any) => void;
    onFocus?: (range: any, source: any, editor: any) => void;
    onBlur?: (previousRange: any, source: any, editor: any) => void;
    bounds?: string | HTMLElement;
    children?: React.ReactElement<any>;
    className?: string;
    id?: string;
    style?: React.CSSProperties;
    tabIndex?: number;
    [key: string]: any;
  }
  
  class ReactQuill extends Component<ReactQuillProps> {
    editor: any;
    editingArea: HTMLElement;
    getEditor(): any;
    focus(): void;
    blur(): void;
  }
  
  export default ReactQuill;
}
