import { ErrorMessage } from '@hookform/error-message';
import clsx from 'clsx';
import { useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { FaPlus, FaSearch, FaTimes } from 'react-icons/fa';

import type { IExtensionOptions } from '../../utils/types';
import { Button } from '../atom/Button';
import { TextInput } from '../atom/TextInput';
import { OptionsTitle } from '../molecule/OptionsTitle';

interface IWebsiteList {
  className?: string;
}

export function WebsiteList({ className }: IWebsiteList) {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<IExtensionOptions>();

  const { fields, prepend, remove } = useFieldArray({
    control,
    name: 'websites',
  });

  const [search, setSearch] = useState<string>('');

  return (
    <div className={className}>
      <OptionsTitle
        title="Blocked Websites"
        description="Websites that will be blocked. You can add new websites by clicking the plus button."
      />
      <div className="mb-2 flex items-center gap-2">
        <TextInput
          className="w-full"
          value={search}
          placeholder="Search..."
          iconLeft={<FaSearch />}
          iconRight={search && <FaTimes />}
          onIconRightClick={() => setSearch('')}
          onChange={e => setSearch(e.target.value.toLowerCase().trim())}
        />
        <Button
          className="!px-2"
          type="button"
          title="Add new website"
          onClick={() => prepend({ address: '' }, { shouldFocus: true })}
        >
          <div className="flex items-center gap-1">
            <FaPlus />
          </div>
        </Button>
      </div>
      <div
        className={clsx(
          '-m-1 flex max-h-60 flex-col items-center gap-1 overflow-y-scroll p-1',
          'rounded-sm border border-slate-300',
        )}
      >
        {!fields.some(field => field.address.includes(search)) && (
          <p className="text-gray-500">No websites found.</p>
        )}
        {fields.map((field, index) => {
          if (search && !field.address.includes(search)) {
            return null;
          }

          return (
            <div key={field.id} className="w-full">
              <div className="flex w-full items-center gap-2">
                <TextInput
                  className="flex-grow"
                  placeholder='Website address, e.g. "google.com"'
                  {...register(`websites.${index}.address`, {
                    required: true,
                    pattern: /^[\w-]+(\.[\w-]+)+$/,
                  })}
                />
                <Button
                  className="!bg-red-600 !px-2"
                  type="button"
                  onClick={() => remove(index)}
                >
                  <FaTimes />
                </Button>
              </div>
              <ErrorMessage
                errors={errors}
                name={`websites.${index}.address`}
                message='Please enter a website address, e.g. "google.com"'
                render={({ message }) => (
                  <p className="text-red-600">{message}</p>
                )}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
