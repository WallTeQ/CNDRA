import React, { useMemo } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Enter content...",
  className = "",
  disabled = false,
}) => {
  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ script: "sub" }, { script: "super" }],
        [{ indent: "-1" }, { indent: "+1" }],
        [{ direction: "rtl" }],
        [{ color: [] }, { background: [] }],
        [{ align: [] }],
        ["link", "image", "video"],
        ["clean"],
      ],
    }),
    []
  );

  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "video",
    "color",
    "background",
    "align",
    "script",
  ];

  return (
    <div className={`rich-text-editor ${className}`}>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        readOnly={disabled}
        style={{
          backgroundColor: disabled ? "#f8f9fa" : "white",
        }}
      />
      <style>{`
        .rich-text-editor .ql-editor {
          min-height: 200px;
          font-family: inherit;
        }
        .rich-text-editor .ql-toolbar {
          border-top: 1px solid #e2e8f0;
          border-left: 1px solid #e2e8f0;
          border-right: 1px solid #e2e8f0;
          border-radius: 0.5rem 0.5rem 0 0;
        }
        .rich-text-editor .ql-container {
          border-bottom: 1px solid #e2e8f0;
          border-left: 1px solid #e2e8f0;
          border-right: 1px solid #e2e8f0;
          border-radius: 0 0 0.5rem 0.5rem;
        }
        .rich-text-editor .ql-editor.ql-blank::before {
          color: #9ca3af;
          font-style: normal;
        }
      `}</style>
    </div>
  );
};
