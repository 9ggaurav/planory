'use client';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverHeader,
  PopoverTitle,
} from '@/components/ui/popover';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from '@/components/ui/field';
import { useState } from 'react';
import { z } from 'zod';
import api from '@/lib/axiosClient';
import axios from 'axios';
import { useBoards } from '@/providers/BoardContext';

type ChildProps = {
  isDialogOpen: boolean;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const newBoardSchema = z.object({
  title: z.string(),
  tag: z.string(),
  isPublic: z.boolean(),
  isTemplate: z.boolean(),
});

export default function AddNewBoard({ isDialogOpen, setIsDialogOpen }: ChildProps) {
  const {addBoard} = useBoards();
  const [form, setForm] = useState({
    title: '',
    tag: '',
    isPublic: false,
    isTemplate: false,
  });
  const [coverImage, setCoverImage] = useState<File | null>(null);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, value, checked } = e.target;

    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      console.log('Please select a valid image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      return;
    }
    setCoverImage(file);
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = newBoardSchema.safeParse(form);

    if (!result.success) {
      console.log('Validation errors: ', result.error.flatten());
      const errors = result.error.flatten().fieldErrors;

      Object.values(errors).forEach(messages => {
        if (messages?.[0]) {
          console.log(messages[0]);
        }
      });
      return;
    }

    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('tag', JSON.stringify([form.tag]));
    formData.append('isPublic', JSON.stringify(form.isPublic));
    formData.append('isTemplate', JSON.stringify(form.isTemplate));

    if (coverImage) {
      formData.append('coverImage', coverImage);
    }

    try {
      const response = await api.post('/boards/boards', formData);
      console.log('Board Created');
      setForm({
        title: '',
        tag: '',
        isPublic: false,
        isTemplate: false,
      });
      setCoverImage(null);
      setIsDialogOpen(false);
      console.log(response.data)
      addBoard(response.data);
      
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message ?? 'Something went wrong';
        console.log('Board Creation failed:', message);
      } else {
        console.log('Unexpected error:', error);
      }
    }
  };

  return (
    <>
      <Popover open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <PopoverTrigger asChild>
          <Button className="hidden hover:cursor-pointer md:block bg-emerald-700 text-white hover:bg-emerald-600">
            Create
          </Button>
        </PopoverTrigger>

        <PopoverContent className="sm:max-w-106.25 bg-[#E8F7F2] top-100 left-100">
          <form onSubmit={handleFormSubmit}>
            <PopoverHeader>
              <PopoverTitle>Create Board</PopoverTitle>
            </PopoverHeader>
            <div className="grid gap-4">
              <div className="grid gap-3">
                <Label htmlFor="title">Title</Label>
                <Input
                  required
                  id="title"
                  name="title"
                  value={form.title}
                  onChange={handleFormChange}
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="tag">Tag</Label>
                <Input required id="tag" name="tag" value={form.tag} onChange={handleFormChange} />
              </div>
              <div className="grid gap-3">
                <FieldLabel>
                  <Field orientation="horizontal">
                    <Input
                      className="size-[0.9rem]"
                      type="checkbox"
                      id="checkbox"
                      name="isPublic"
                      checked={form.isPublic}
                      onChange={handleFormChange}
                    />
                    <FieldContent>
                      <FieldTitle>Publish Board</FieldTitle>
                      <FieldDescription>
                        Make this board public so that others can see it too.
                      </FieldDescription>
                    </FieldContent>
                  </Field>
                </FieldLabel>
              </div>
              <div className="grid gap-3">
                <FieldLabel>
                  <Field orientation="horizontal">
                    <Input
                      className="size-[0.9rem]"
                      type="checkbox"
                      id="isTemplate"
                      name="isTemplate"
                      checked={form.isTemplate}
                      onChange={handleFormChange}
                    />
                    <FieldContent>
                      <FieldTitle>Create Template</FieldTitle>
                      <FieldDescription>is This board a Template?</FieldDescription>
                    </FieldContent>
                  </Field>
                </FieldLabel>
              </div>
              <div>
                <FieldLabel>
                  <Field orientation="horizontal">
                    <Input
                      accept="image/*"
                      name="coverImage"
                      onChange={handleFileChange}
                      type="file"
                      placeholder="cover image"
                    />
                  </Field>
                </FieldLabel>
              </div>
            </div>
            <Button type="submit">Create</Button>
          </form>
        </PopoverContent>
      </Popover>
    </>
  );
}
