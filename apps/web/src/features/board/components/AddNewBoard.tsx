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

type ChildProps = {
  boardData: BoardType;
  handleChange: React.ChangeEventHandler<HTMLInputElement>;
  handleSubmit: React.FormEventHandler<HTMLFormElement>;
  isDialogOpen: boolean;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
};


export default function AddNewBoard({boardData, isDialogOpen, setIsDialogOpen, handleSubmit, handleChange}: ChildProps) {
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