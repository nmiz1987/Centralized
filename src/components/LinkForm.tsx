'use client';

import { useActionState } from 'react';
import { useRouter } from 'next/navigation';
import { Link } from '@/db/schema';
import { Form, FormGroup, FormLabel, FormInput, FormTextarea, FormError, FormSelect } from './ui/Form';
import { createLink, updateLink, type ActionResponse } from '@/actions/links';
import { Button } from './ui/button';
import toast from 'react-hot-toast';
import { TOAST_STYLES } from '@/lib/constants';
import { WebsiteIconFetcher } from './WebsiteIconFetcher';
import { useState } from 'react';
import { Checkbox } from './ui/checkbox';
import Image from 'next/image';

interface LinkFormProps {
  link?: Link;
  isEditing?: boolean;
  categories: string[];
}

const initialState: ActionResponse = {
  success: false,
  message: '',
  errors: undefined,
  values: undefined,
};

export function LinkForm({ link, isEditing = false, categories }: LinkFormProps) {
  const router = useRouter();
  const [isUsingCustomIcon, setIsUsingCustomIcon] = useState(false);
  const [selectedIconUrl, setSelectedIconUrl] = useState<string | undefined>(undefined);
  const [websiteUrl, setWebsiteUrl] = useState<string | undefined>(link?.url || undefined); // the url in the link

  const [state, formAction, isPending] = useActionState<ActionResponse, FormData>(async (prevState: ActionResponse, formData: FormData) => {
    try {
      // Extract data from form
      const data = {
        category: formData.get('category') as string,
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        icon: isUsingCustomIcon ? (formData.get('icon') as string) : selectedIconUrl,
        url: formData.get('url') as string,
        isRecommended: formData.get('isRecommended') === 'true',
      };

      // Call the appropriate action based on whether we're editing or creating
      const result = isEditing ? await updateLink(Number(link!.id), data) : await createLink(data);

      // Handle successful submission
      if (result.success) {
        toast.success(result.message, TOAST_STYLES.success);
        router.refresh();
        if (!isEditing) {
          router.push('/dashboard');
        }
      }

      return result;
    } catch (err) {
      return {
        success: false,
        message: (err as Error).message || 'An error occurred',
        errors: undefined,
      };
    }
  }, initialState);

  const handleIconSelect = (iconUrl: string) => {
    setSelectedIconUrl(iconUrl);
    setIsUsingCustomIcon(false);
  };

  return (
    <Form action={formAction}>
      {state?.message && !state.success && (
        <FormError className={`mb-4 rounded-lg px-4 py-2 ${state.success ? 'border-green-300 bg-green-100 text-green-800' : ''}`}>
          {state.message}
        </FormError>
      )}

      <FormGroup>
        <FormLabel htmlFor="name">Name</FormLabel>
        <FormInput
          id="name"
          name="name"
          placeholder="Link's name"
          defaultValue={state?.values?.name || link?.name || ''}
          required
          minLength={3}
          maxLength={100}
          disabled={isPending}
          aria-describedby="name-error"
          className={state?.errors?.name ? 'border-red-500' : ''}
        />
        {state?.errors?.name && (
          <p id="name-error" className="text-sm text-red-500">
            {state.errors.name.join(', ')}
          </p>
        )}
      </FormGroup>

      <FormGroup>
        <FormLabel htmlFor="description">Description</FormLabel>
        <FormTextarea
          id="description"
          name="description"
          placeholder="Describe the link..."
          rows={4}
          minLength={3}
          maxLength={255}
          defaultValue={state?.values?.description || link?.description || ''}
          disabled={isPending}
          aria-describedby="description-error"
          className={state?.errors?.description ? 'border-red-500' : ''}
        />
        {state?.errors?.description && (
          <p id="description-error" className="text-sm text-red-500">
            {state.errors.description.join(', ')}
          </p>
        )}
      </FormGroup>

      <FormGroup>
        <FormLabel htmlFor="category">Category</FormLabel>
        <FormInput
          list="categories"
          id="category"
          name="category"
          placeholder="Category"
          defaultValue={state?.values?.category || link?.category || ''}
          disabled={isPending}
          aria-describedby="category-error"
          className={state?.errors?.category ? 'border-red-500' : ''}
        />
        {state?.errors?.category && (
          <p id="category-error" className="text-sm text-red-500">
            {state.errors.category.join(', ')}
          </p>
        )}
        <datalist id="categories">
          {categories.map(cat => (
            <option value={cat} key={cat} />
          ))}
        </datalist>
      </FormGroup>

      <FormGroup>
        <FormLabel htmlFor="url">URL</FormLabel>
        <div className="flex items-center gap-2">
          <FormInput
            id="url"
            name="url"
            placeholder="URL"
            onChange={e => setWebsiteUrl(e.target.value)}
            defaultValue={state?.values?.url || link?.url || ''}
            disabled={isPending}
            aria-describedby="url-error"
            className={state?.errors?.url ? 'border-red-500' : ''}
          />
          <WebsiteIconFetcher url={websiteUrl || ''} onIconSelect={handleIconSelect} isDisabled={isPending} />
        </div>
        {state?.errors?.url && (
          <p id="url-error" className="text-sm text-red-500">
            {state.errors.url.join(', ')}
          </p>
        )}
      </FormGroup>

      <FormGroup>
        <div className="flex items-center justify-between">
          <FormLabel htmlFor="icon">Icon</FormLabel>
          <div className="flex items-center gap-2">
            <Checkbox
              button-name="toggle-custom-icon"
              id="isUsingCustomIcon"
              checked={isUsingCustomIcon}
              onCheckedChange={(checked: boolean) => setIsUsingCustomIcon(checked)}
              disabled={isPending}
            />
            <label htmlFor="isUsingCustomIcon" className="text-sm text-gray-500">
              Use custom icon
            </label>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <FormInput
              id="icon"
              name="icon"
              placeholder="Icon URL"
              defaultValue={state?.values?.icon || link?.icon || ''}
              disabled={isPending || !isUsingCustomIcon}
              aria-describedby="icon-error"
              className={state?.errors?.icon ? 'border-red-500' : ''}
            />
            {state?.errors?.icon && (
              <p id="icon-error" className="text-sm text-red-500">
                {state.errors.icon.join(', ')}
              </p>
            )}
          </div>
          {(selectedIconUrl || link?.icon) && !isUsingCustomIcon && (
            <div className="border-medium flex flex-col items-center gap-2 rounded-lg border p-2">
              <div className="relative h-8 w-8">
                <Image src={selectedIconUrl || link?.icon || ''} alt="Selected icon preview" fill className="object-contain" unoptimized />
              </div>
            </div>
          )}
        </div>
      </FormGroup>

      <FormGroup>
        <FormLabel htmlFor="isRecommended">Is Recommended</FormLabel>
        <FormSelect
          id="isRecommended"
          name="isRecommended"
          defaultValue={state?.values?.isRecommended || link?.isRecommended ? 'true' : 'false'}
          options={[
            { label: 'True', value: 'true' },
            { label: 'False', value: 'false' },
          ]}
          disabled={isPending}
          required
          aria-describedby="is-recommended-error"
          className={state?.errors?.isRecommended ? 'border-red-500' : ''}
        />
        {state?.errors?.isRecommended && (
          <p id="is-recommended-error" className="text-sm text-red-500">
            {state.errors.isRecommended.join(', ')}
          </p>
        )}
      </FormGroup>

      <div className="mt-6 flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={() => router.back()} disabled={isPending}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isPending} disabled={isPending}>
          {isEditing ? 'Update Link' : 'Create Link'}
        </Button>
      </div>
    </Form>
  );
}
