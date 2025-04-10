import { Switch } from '@headlessui/react'
import { useEffect, useState } from 'react';

export default function WTSwitch(props: any) {
    const { label, name, disabled, defaultValue, onChange } = props;
    const [enabled, setEnabled] = useState(defaultValue || false);

    useEffect(() => {
        setEnabled(defaultValue || false);
    }, [defaultValue]);

    const handleChange = (val: boolean) => {
        onChange?.(val);
        setEnabled(val);
    }

    return (
        <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-white">{label}</label>
            <Switch
                disabled={disabled}
                checked={enabled}
                onChange={handleChange}
                className={
                    `${enabled ? 'bg-primary disabled:bg-primary/50' : 'bg-gray-300'} \
                    relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent \
                    transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white/75`
                }
            >
                <span
                    aria-hidden="true"
                    className={`${enabled ? 'translate-x-5' : 'translate-x-0'} \
            pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out`}
                />
            </Switch>
            <input name={name} type='hidden' value={enabled} />
        </div>
    )
}
