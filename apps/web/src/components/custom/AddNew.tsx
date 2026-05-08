import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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

export default function AddNewSection({boardData, isDialogOpen, setIsDialogOpen, handleSubmit, handleChange}: ChildProps) {
    return (
        <>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="hidden hover:cursor-pointer md:block bg-[#E07A5F] text-white hover:bg-[#c64927]">
                Create
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-106.25 bg-[#E8F7F2]">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>Create Board</DialogTitle>
                </DialogHeader>
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
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="outline">
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button type="submit">Create</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        
        </>
    )
}