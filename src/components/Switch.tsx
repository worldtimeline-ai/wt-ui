import { Switch } from '@headlessui/react';
import { useEffect, useState } from 'react';

interface WTSwitchProps {
    label: string;
    name: string;
    disabled?: boolean;
    defaultValue?: boolean;
    onChange?: (value: boolean) => void;
}

export default function WTSwitch({
    label,
    name,
    disabled = false,
    defaultValue = false,
    onChange,
}: WTSwitchProps) {
    const [enabled, setEnabled] = useState(defaultValue);

    useEffect(() => {
        setEnabled(defaultValue);
    }, [defaultValue]);

    const handleChange = (val: boolean) => {
        onChange?.(val);
        setEnabled(val);
    };

    return (
        <div className="flex flex-col gap-1">
            <label htmlFor={name} className="text-xs font-medium text-white">
                {label}
            </label>
            <Switch
                id={name}
                disabled={disabled}
                checked={enabled}
                onChange={handleChange}
                aria-checked={enabled}
                className={`${enabled ? 'bg-primary disabled:bg-primary/50' : 'bg-gray-300'
                    } relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75`}
            >
                <span
                    aria-hidden="true"
                    className={`${enabled ? 'translate-x-5' : 'translate-x-0'
                        } pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out`}
                />
            </Switch>
            <input name={name} type="hidden" value={enabled.toString()} />
        </div>
    );
}