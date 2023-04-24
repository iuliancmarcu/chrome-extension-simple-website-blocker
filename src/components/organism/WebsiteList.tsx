import { ErrorMessage } from '@hookform/error-message';
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
          iconRight={
            search ? (
              <FaTimes role="button" onClick={() => setSearch('')} />
            ) : null
          }
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
      <div className="-m-1 flex max-h-56 flex-col items-center gap-1 overflow-y-scroll p-1">
        {!fields.some(field => field.address.includes(search)) && (
          <p className="text-gray-500">No websites found.</p>
        )}
        {fields.map((field, index) => {
          if (search && !field.address.includes(search)) {
            return null;
          }

          return (
            <div key={field.id} className="w-full">
              <TextInput
                className="w-full"
                placeholder='Website address, e.g. "google.com"'
                iconRight={
                  <FaTimes role="button" onClick={() => remove(index)} />
                }
                {...register(`websites.${index}.address`, {
                  required: true,
                  pattern: /^[\w-]+(\.[\w-]+)+$/,
                })}
              />
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
