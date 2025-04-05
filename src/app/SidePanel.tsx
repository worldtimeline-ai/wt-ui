import { useEffect, useMemo, useRef, useState } from "react";
import WTCheckbox from "../components/Checkbox";

const SidePanel = (props: any) => {
    const { events, tags, setTags } = props;
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setTags([...(new Set(...events?.map((ev: any) => ev.tags)))].map((t) => ({ name: t, selected: true })));
    }, [events]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleTagChecked = (toggleTag: string, checked: boolean) => {
        const updatedTags = tags?.map((tag: any) =>
            tag.name === toggleTag
                ? { ...tag, selected: checked }
                : tag
        );
        setTags(updatedTags);
    }

    return (
        <div className="flex flex-col gap-2 fixed left-10 top-20 w-1/4">
            <div tabIndex={0} className="collapse">
                <div className="cursor-pointer text-xs pl-[1rem]">
                    <div className="bg-blue-500 text-white rounded-lg p-2 w-14 flex items-center justify-center">Events</div>
                </div>
                <div className="collapse-content">
                    <div className="max-h-96 overflow-y-auto flex flex-col gap-1 bg-white rounded-lg">
                        {events.map((ev: any) => (
                            <div className="border-b-1 p-4 cursor-pointer">
                                <p className="text-[12px]">{ev.description}</p>
                                <div className="flex gap-1">
                                    <div className="text-[8px] py-1 px-2 rounded-full bg-gray-300">{ev.year}</div>
                                    {ev.tags.map((tag: string) => (
                                        <div key={tag} className="text-[8px] py-1 px-2 rounded-full bg-gray-300">{tag}</div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div ref={wrapperRef} className={`collapse ${isOpen ? 'collapse-open' : 'collapse-close'} `}>
                <div className="cursor-pointer text-xs pl-[1rem]" onClick={() => setIsOpen((prev) => !prev)}>
                    <div className="bg-blue-500 text-white rounded-lg p-2 w-14 flex items-center justify-center">Tags</div>
                </div>
                <div className="collapse-content">
                    <div className="max-h-96 overflow-y-auto flex flex-col gap-1 bg-white rounded-lg">
                        {[...tags].map((tag: any) => (
                            <div key={tag} className="border-b-1 p-4">
                                <WTCheckbox label={tag.name} defaultChecked={tag.selected} onChange={(checked: boolean) => handleTagChecked(tag.name, checked)} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SidePanel;