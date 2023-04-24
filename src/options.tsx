import { ErrorMessage } from '@hookform/error-message';
import clsx from 'clsx';
import React, { useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import { FormProvider, useForm } from 'react-hook-form';

import { Button } from './components/atom/Button';
import { TextInput } from './components/atom/TextInput';
import { OptionsTitle } from './components/molecule/OptionsTitle';
import { WebsiteList } from './components/organism/WebsiteList';
import { useExtensionOptions } from './hooks/useExtensionOptions';
import type { IExtensionOptions } from './utils/types';

export const Options = () => {
  const formMethods = useForm<IExtensionOptions>();
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isDirty },
  } = formMethods;

  const syncOptions = useExtensionOptions(data => reset(data));

  const saveOptions = useCallback(
    (data: IExtensionOptions) => {
      syncOptions(data);
      reset(data);
    },
    [reset, syncOptions],
  );

  return (
    <div className="min-w-[480px]">
      <FormProvider {...formMethods}>
        <form
          className="flex flex-col gap-4 p-4"
          onSubmit={handleSubmit(saveOptions)}
        >
          <div className="flex flex-col gap-1">
            <OptionsTitle
              title="Warning Message"
              description="This message will be displayed in the browser, whenever a blocked website is visited."
            />
            <TextInput
              placeholder="Message"
              {...register('warningMessage', { required: true })}
            />
            <ErrorMessage
              errors={errors}
              name="warningMessage"
              message="This field is required."
              render={({ message }) => (
                <p className="text-red-600">{message}</p>
              )}
            />
          </div>
          <div className="flex flex-col gap-1">
            <OptionsTitle
              title="Confirm"
              description="If enabled, there will be a confirmation dialog before the website is blocked."
            />
            <div className="flex items-center gap-2">
              <label
                className="flex items-center gap-2"
                htmlFor="enableConfirm"
              >
                <input type="checkbox" {...register('enableConfirm')} />
                Enable confirmation warning
              </label>
            </div>
          </div>
          <WebsiteList />
          <div className="flex items-end justify-between">
            <div className="text-xs text-neutral-300">
              Built with ❤️ by{' '}
              <a
                className="text-blue-300"
                href="https://iulianmarcu.me/?utm_source=simple-website-blocker-chrome"
                target="_blank"
                rel="noreferrer"
              >
                Iulian-Constantin Marcu
              </a>
            </div>
            <Button
              className={clsx({
                '!bg-green-600': isDirty,
                '!bg-gray-300': !isDirty,
              })}
              type="submit"
              disabled={!isDirty}
            >
              Save Changes
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);

root.render(
  <React.StrictMode>
    <Options />
  </React.StrictMode>,
);
