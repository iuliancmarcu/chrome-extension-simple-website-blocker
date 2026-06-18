import { ErrorMessage } from '@hookform/error-message';
import { FormProvider, useForm } from 'react-hook-form';
import { FaCheck } from 'react-icons/fa';

import { TextInput } from './components/atom/TextInput';
import { OptionsTitle } from './components/molecule/OptionsTitle';
import { WebsiteList } from './components/organism/WebsiteList';
import { useAutoSaveOptions } from './hooks/useAutoSaveOptions';
import type { IExtensionOptions } from './utils/types';

export const OptionsPage = () => {
  const formMethods = useForm<IExtensionOptions>({ mode: 'onBlur' });
  const {
    register,
    formState: { errors },
  } = formMethods;

  const status = useAutoSaveOptions(formMethods);

  return (
    <div className="min-w-[480px]">
      <FormProvider {...formMethods}>
        <form
          className="flex flex-col gap-4 p-4"
          onSubmit={e => e.preventDefault()}
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
            <div
              className="flex items-center gap-1 text-sm text-neutral-500"
              aria-live="polite"
            >
              {status === 'saving' ? (
                <span>Saving…</span>
              ) : (
                <>
                  <FaCheck className="text-green-600" />
                  <span>All changes saved</span>
                </>
              )}
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};
