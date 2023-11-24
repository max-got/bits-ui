import type { APISchema } from "@/types";
import { accordion } from "./accordion";
import { alertDialog } from "./alert-dialog";
import { dialog } from "./dialog";
import { aspectRatio } from "./aspect-ratio";
import { avatar } from "./avatar";
import { button } from "./button";
import { checkbox } from "./checkbox";
import { collapsible } from "./collapsible";
import { contextMenu } from "./context-menu";
import { dropdownMenu } from "./dropdown-menu";
import { label } from "./label";
import { linkPreview } from "./link-preview";
import { popover } from "./popover";
import { menubar } from "./menubar";
import { progress } from "./progress";
import { radioGroup } from "./radio-group";
import { select } from "./select";
import { separator } from "./separator";
import { slider } from "./slider";
import { switchData } from "./switch";
import { tabs } from "./tabs";
import { toggle } from "./toggle";
import { toggleGroup } from "./toggle-group";
import { tooltip } from "./tooltip";

export const bits = [
	"accordion",
	"alert-dialog",
	"aspect-ratio",
	"avatar",
	"button",
	"calendar",
	"checkbox",
	"collapsible",
	"context-menu",
	"dialog",
	"dropdown-menu",
	"link-preview",
	"label",
	"menubar",
	"popover",
	"progress",
	"radio-group",
	"select",
	"separator",
	"slider",
	"switch",
	"tabs",
	"toggle",
	"toggle-group",
	"tooltip"
] as const;

export const bitsSet = new Set(bits);

export function isBit(value: string): value is (typeof bits)[number] {
	return bitsSet.has(value as (typeof bits)[number]);
}

export type Bit = (typeof bits)[number];

export const apiSchemas: Record<Bit, APISchema[]> = {
	accordion,
	"alert-dialog": alertDialog,
	"aspect-ratio": aspectRatio,
	avatar,
	button,
	calendar: [],
	checkbox,
	collapsible,
	"context-menu": contextMenu,
	dialog,
	"dropdown-menu": dropdownMenu,
	label,
	"link-preview": linkPreview,
	menubar,
	popover,
	progress,
	"radio-group": radioGroup,
	select,
	separator,
	slider,
	switch: switchData,
	tabs,
	toggle: toggle,
	"toggle-group": toggleGroup,
	tooltip
};

export function getAPISchemas(bit: Bit): APISchema[] {
	return apiSchemas[bit];
}

export * from "./helpers";
