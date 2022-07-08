import React, { ForwardedRef } from "react";

export const ContentEditable = ({
  value,
  setValue,
  forwardedRef,
  className,
}: {
  value: string;
  setValue: (value: string) => void;
  forwardedRef?: ForwardedRef<HTMLSpanElement>;
  className?: string;
}) => {
  return (
    <span
      contentEditable={true}
      suppressContentEditableWarning={true}
      className={`block -ml-1 px-1 pt-1 border-b-2 border-transparent focus:border-b-gray-200 box-content group-hover:bg-gray-50 focus:!bg-gray-100 focus:outline-none cursor-pointer focus:cursor-text ${className}`}
      ref={forwardedRef}
      onBlur={(e) => setValue(e.target.innerText)}
      onKeyDown={(e: React.KeyboardEvent<HTMLSpanElement>) => {
        // Keyboard shortcuts to finish editing
        if (e.key == "Enter" || e.key == "Tab" || e.key == "Escape") {
          e.preventDefault();
          e.currentTarget.blur();
        }
      }}
      onFocus={(e) => {
        // Move cursor to end of text
        const selection = window.getSelection();
        if (!selection || selection.rangeCount == 0) return;
        const range = selection.getRangeAt(0);
        try {
          range.setStart(e.target, 1);
          range.setEnd(e.target, 1);
          selection.removeAllRanges();
          selection.addRange(range);
        } catch (e) {} // ignore DOMException: invalid selection
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {value}
    </span>
  );
};

// Use WrappedContentEditable to forward a ref so you can focus it outside of the component
const WrappedContentEditable = React.forwardRef(
  (
    {
      value,
      setValue,
      className,
    }: {
      value: string;
      setValue: (value: string) => void;
      className?: string;
    },
    ref: ForwardedRef<HTMLSpanElement | null>
  ) => {
    return (
      <ContentEditable
        value={value}
        setValue={setValue}
        className={className}
        forwardedRef={ref}
      />
    );
  }
);

export default WrappedContentEditable;
