import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverHeader,
  PopoverTitle,
} from "@/components/ui/popover"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field"
import type { userBoard as BoardType } from '@repo/shared';
import { useState } from "react"
import {z} from "zod";

type ChildProps = {
  boardData: BoardType;
  handleChange: React.ChangeEventHandler<HTMLInputElement>;
  handleSubmit: React.FormEventHandler<HTMLFormElement>;
  isDialogOpen: boolean;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const newBoardSchema = z.object({
  title: z.string(),
  tag: z.array(z.string()),
  isPublic: z.boolean(),
  isTemplate: z.boolean(),
})


export default function AddNewBoard({boardData, isDialogOpen, setIsDialogOpen, handleSubmit, handleChange}: ChildProps) {
  const [form, setForm] = useState({
    title: "",
    tag: [],
    isPublic: false,
    isTemplate: false
  })
  const [coverImage, setCoverImage] = useState<File | null>(null);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      console.log("Please select a valid image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      return;
    }
    setCoverImage(file);
  }

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = newBoardSchema.safeParse(form);

    if (!result.success) {
      console.log('Validation errors: ', result.error.flatten());
      const errors = result.error.flatten().fieldErrors;

      Object.values(errors).forEach(messages => {
        if (messages?.[0]) {
          console.log(messages[0])
        }
      });
      return;
    }

    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('tag', JSON.stringify(form.tag));
    formData.append('isPublic', JSON.stringify(form.isPublic));
    formData.append('isTemplate', JSON.stringify(form.isTemplate));

    if (coverImage) {
      formData.append('coverImage', coverImage);
    }

    console.log(formData)

  }

    return (
        <>
            <Popover open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <PopoverTrigger asChild>
              <Button className="hidden hover:cursor-pointer md:block bg-emerald-700 text-white hover:bg-emerald-600">
                Create
              </Button>
            </PopoverTrigger>

            <PopoverContent className="sm:max-w-106.25 bg-[#E8F7F2] top-100 left-100">
              <form onSubmit={handleSubmit}>
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
                      value={boardData.title}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="tag">Tag</Label>
                    <Input
                      required
                      id="tag"
                      name="tag"
                      value={boardData.tag}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="grid gap-3">
                    <FieldLabel>
                      <Field orientation="horizontal">
                        <Input
                          className="size-[0.9rem]"
                          type="checkbox"
                          id="checkbox"
                          name="isPublic"
                          checked={boardData.isPublic}
                          onChange={handleChange}
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
                          checked={boardData.isTemplate}
                          onChange={handleChange}
                        />
                        <FieldContent>
                          <FieldTitle>Create Template</FieldTitle>
                          <FieldDescription>
                            is This board a Template?
                          </FieldDescription>
                        </FieldContent>
                      </Field>
                    </FieldLabel>
                  </div>
                </div>
                <Button type="submit">Create</Button>
              </form>
            </PopoverContent>
          </Popover>
        
        </>
    )
}