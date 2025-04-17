import { useCallback, useEffect, useRef, useState } from "react";
import WTCheckbox from "../components/Checkbox";
import Switch from '../components/Switch';

const initialCollapseState = {
    events: true,
    tags: true,
}

const SidePanel = (props: any) => {
    const { events, setEvents, tags, setTags, startingUp, setStartingUp } = props;
    const [collapseState, setCollapseState] = useState(initialCollapseState);
    const eventsWrapperRef = useRef<HTMLDivElement>(null);
    const tagsWrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                eventsWrapperRef.current &&
                !eventsWrapperRef.current.contains(event.target as Node)
            ) {
                setCollapseState((prev) => ({ ...prev, events: true }));
            }
            if (
                tagsWrapperRef.current &&
                !tagsWrapperRef.current.contains(event.target as Node)
            ) {
                setCollapseState((prev) => ({ ...prev, tags: true }));
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

    const handleHover = useCallback((event: any) => {
        const newEvents = [...events];
        newEvents.find((ev: any) => ev.description === event.description).hovered = true;
        setEvents(newEvents);
    }, [events]);

    const handleLeave = useCallback((event: any) => {
        const newEvents = [...events];
        newEvents.find((ev: any) => ev.description === event.description).hovered = false;
        setEvents(newEvents);
    }, [events]);

    return (
        <div className="flex flex-col gap-4 fixed left-10 top-20 w-1/4 bg-gray-700/70 p-2 rounded-lg">
            <h3 className="text-white text-center">Control Panel</h3>
            <div>
                <Switch name='freeze_auto_update' label='Freeze Auto Updates' defaultValue={startingUp} onChange={setStartingUp} />
            </div>
            <div ref={eventsWrapperRef} className={`collapse ${!collapseState.events ? 'collapse-open' : 'collapse-close'} `}>
                <div className="cursor-pointer text-xs" onClick={() => setCollapseState((prev) => ({ ...prev, events: false }))}>
                    <div className="bg-blue-500 text-white rounded-lg p-2 w-14 flex items-center justify-center">Events</div>
                </div>
                <div className="collapse-content">
                    <div className="max-h-96 overflow-y-auto flex flex-col gap-1 bg-white/50 hover:bg-white/70 rounded-lg">
                        {events
                            .filter((ev: any) => ev.tags?.some((et: any) => tags.find((t: any) => t.name == et)?.selected))
                            .map((ev: any) => (
                                <div
                                    className="border-b-1 p-4 cursor-pointer"
                                    onMouseEnter={() => handleHover(ev)}
                                    onMouseLeave={() => handleLeave(ev)}>
                                    <p className="text-[12px]">{ev.description}</p>
                                    <div className="flex gap-1">
                                        <div className="text-[8px] py-1 px-2 rounded-full bg-gray-300">{ev.year}</div>
                                        {ev.tags.map((tag: string) => (
                                            <div key={`ev-${tag}`} className="text-[8px] py-1 px-2 rounded-full bg-gray-300">{tag}</div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            </div>
            <div ref={tagsWrapperRef} className={`collapse ${!collapseState.tags ? 'collapse-open' : 'collapse-close'} `}>
                <div className="cursor-pointer text-xs" onClick={() => setCollapseState((prev) => ({ ...prev, tags: false }))}>
                    <div className="bg-blue-500 text-white rounded-lg p-2 w-14 flex items-center justify-center">Tags</div>
                </div>
                <div className="collapse-content">
                    <div className="max-h-96 overflow-y-auto flex flex-col gap-1 bg-white/50 hover:bg-white/70 rounded-lg">
                        {tags.map((tag: any) => (
                            <div key={`${tag.name}`} className="border-b-1 p-4">
                                <WTCheckbox label={tag.name} defaultChecked={tag.selected} onChange={(checked: boolean) => handleTagChecked(tag.name, checked)} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div >
    );
};

export default SidePanel;