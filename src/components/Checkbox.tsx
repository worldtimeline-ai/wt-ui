import { useState, useEffect } from 'react';
import { Checkbox } from '@headlessui/react';
import { CheckIcon } from '@heroicons/react/solid';

export default function WTCheckbox(props: any) {
    const { label, name, defaultChecked, disabled, onChange } = props;
    const [checked, setChecked] = useState(defaultChecked || false);

    useEffect(() => {
        setChecked(defaultChecked);
    }, [defaultChecked]);

    const handleChange = () => {
        setChecked(!checked);
        onChange?.(!checked);
    }

    return (
        <div className='flex gap-2 items-center'>
            <Checkbox
                disabled={disabled}
                onChange={handleChange}
                onClick={(e) => e.stopPropagation()}
                onFocusCapture={(e) => e.stopPropagation()}
                checked={checked}
                className={`group w-5 h-5 rounded-md p-1 border-1 ${disabled ? 'bg-gray-200 text-gray-500 data-[checked]:bg-primary/70' : 'bg-white/10 data-[checked]:bg-primary'}`}
            >
                <CheckIcon className={`hidden fill-white group-data-[checked]:block`} />
            </Checkbox>
            {label && <label
                onClick={(e) => e.stopPropagation()}
                onFocusCapture={(e) => e.stopPropagation()}
                className="capitalize text-xs font-medium text-gray-700 dark:text-white">
                {label}
            </label>}
            <input type='hidden' name={name} value={checked} />
        </div>
    )
}
