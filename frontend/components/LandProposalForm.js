

import {
    Button,
    Checkbox,
    FileInput,
    Label,
    Radio,
    RangeSlider,
    Select,
    Textarea,
    TextInput,
    ToggleSwitch,
  } from "flowbite-react";
export function LandProposalForm({handleSubmit}) {
  return (
    <form onSubmit={handleSubmit} className="flex max-w-md flex-col gap-4">
      <div>
        <div className="mb-2 block">
          <Label htmlFor="title" value="Title" />
        </div>
        <TextInput id="title" type="text" placeholder="title example" required />
      </div>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="location" value="location" />
        </div>
        <TextInput id="location" type="text" placeholder="31.2559, 54.98866" required />
      </div>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="price" value="Price" />
        </div>
        <TextInput id="price" type="number" required />
      </div>
      {/* <div className="flex items-center gap-2">
        <Checkbox id="remember" />
        <Label htmlFor="remember">Remember me</Label>
      </div> */}

      <div>
        <div className="mb-2 block">
          <Label htmlFor="contracts" value="Contracts" />
        </div>
        <FileInput id="contracts" type="file"   />
      </div>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="images" value="Images" />
        </div>
        <FileInput id="images" type="file"  />
      </div>
      

      <Button color={"blue"} type="submit">Submit</Button>


    </form>
  );
}
