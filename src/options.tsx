import { ErrorMessage } from '@hookform/error-message';
import React, { useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import { FormProvider, useForm } from 'react-hook-form';

import { Button } from './components/atom/Button';
import { TextInput } from './components/atom/TextInput';
import { OptionsTitle } from './components/molecule/OptionsTitle';
import { WebsiteList } from './components/organism/WebsiteList';
import { useExtensionOptions } from './hooks/useExtensionOptions';
import type { IExtensionOptions } from './utils/types';

const Options = () => {
  const formMethods = useForm<IExtensionOptions>();
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isDirty, isValid },
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
    <>
      <FormProvider {...formMethods}>
        <form className="p-4" onSubmit={handleSubmit(saveOptions)}>
          <div className="mb-4 flex flex-col gap-1">
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
          <div className="mb-4 flex flex-col gap-1">
            <OptionsTitle
              title="Dismiss"
              description="If enabled, the warning message will have a dismiss button and the user will be able to visit the website."
            />
            <div className="flex items-center gap-2">
              <label
                className="flex items-center gap-2"
                htmlFor="enableDismiss"
              >
                <input type="checkbox" {...register('enableDismiss')} />
                Enable warning dismiss
              </label>
            </div>
          </div>
          <WebsiteList className="mb-6" />
          <div className="flex flex-col items-end gap-0.5">
            <Button
              className="bg-green-600 disabled:bg-gray-300"
              type="submit"
              disabled={!isDirty || !isValid}
            >
              Save Changes
            </Button>
          </div>
        </form>
      </FormProvider>
    </>
  );
};

const root = createRoot(document.getElementById('root')!);

root.render(
  <React.StrictMode>
    <Options />
  </React.StrictMode>,
);
