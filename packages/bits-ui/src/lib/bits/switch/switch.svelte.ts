import {
	getAriaChecked,
	getAriaRequired,
	getDataChecked,
	getDataDisabled,
	getDataRequired,
	getDisabledAttr,
} from "$lib/internal/attrs.js";
import type { ReadableBoxedValues, WritableBoxedValues } from "$lib/internal/box.svelte.js";
import { kbd } from "$lib/internal/kbd.js";
import { createContext } from "$lib/internal/createContext.js";
import type { WithRefProps } from "$lib/internal/types.js";
import { useRefById } from "$lib/internal/useRefById.svelte.js";

const ROOT_ATTR = "data-switch-root";
const THUMB_ATTR = "data-switch-thumb";

type SwitchRootStateProps = WithRefProps<
	ReadableBoxedValues<{
		disabled: boolean;
		required: boolean;
		name: string | undefined;
		value: string;
	}> &
		WritableBoxedValues<{
			checked: boolean;
		}>
>;
class SwitchRootState {
	#id: SwitchRootStateProps["id"];
	#ref: SwitchRootStateProps["ref"];
	checked: SwitchRootStateProps["checked"];
	disabled: SwitchRootStateProps["disabled"];
	required: SwitchRootStateProps["required"];
	name: SwitchRootStateProps["name"];
	value: SwitchRootStateProps["value"];

	constructor(props: SwitchRootStateProps) {
		this.checked = props.checked;
		this.disabled = props.disabled;
		this.required = props.required;
		this.name = props.name;
		this.value = props.value;
		this.#id = props.id;
		this.#ref = props.ref;

		useRefById({
			id: this.#id,
			ref: this.#ref,
		});
	}

	#toggle() {
		this.checked.value = !this.checked.value;
	}

	#onkeydown = (e: KeyboardEvent) => {
		if (!(e.key === kbd.ENTER || e.key === kbd.SPACE) || this.disabled.value) return;
		e.preventDefault();
		this.#toggle();
	};

	#onclick = () => {
		if (this.disabled.value) return;
		this.#toggle();
	};

	createInput() {
		return new SwitchInputState(this);
	}

	createThumb(props: SwitchThumbStateProps) {
		return new SwitchThumbState(props, this);
	}

	sharedProps = $derived.by(() => ({
		"data-disabled": getDataDisabled(this.disabled.value),
		"data-state": getDataChecked(this.checked.value),
		"data-required": getDataRequired(this.required.value),
	}));

	props = $derived.by(
		() =>
			({
				...this.sharedProps,
				id: this.#id.value,
				role: "switch",
				disabled: getDisabledAttr(this.disabled.value),
				"aria-checked": getAriaChecked(this.checked.value),
				"aria-required": getAriaRequired(this.required.value),
				[ROOT_ATTR]: "",
				//
				onclick: this.#onclick,
				onkeydown: this.#onkeydown,
			}) as const
	);
}

class SwitchInputState {
	#root: SwitchRootState;
	shouldRender = $derived.by(() => this.#root.name.value !== undefined);

	constructor(root: SwitchRootState) {
		this.#root = root;
	}

	props = $derived.by(
		() =>
			({
				type: "checkbox",
				name: this.#root.name.value,
				value: this.#root.value.value,
				checked: this.#root.checked.value,
				disabled: this.#root.disabled.value,
				required: this.#root.required.value,
			}) as const
	);
}

type SwitchThumbStateProps = WithRefProps;

class SwitchThumbState {
	#id: SwitchThumbStateProps["id"];
	#ref: SwitchThumbStateProps["ref"];
	root: SwitchRootState;

	constructor(props: SwitchThumbStateProps, root: SwitchRootState) {
		this.root = root;
		this.#id = props.id;
		this.#ref = props.ref;

		useRefById({
			id: this.#id,
			ref: this.#ref,
		});
	}

	props = $derived.by(
		() =>
			({
				...this.root.sharedProps,
				id: this.#id.value,
				[THUMB_ATTR]: "",
			}) as const
	);
}

//
// CONTEXT METHODS
//

const [setSwitchRootContext, getSwitchRootContext] = createContext<SwitchRootState>("Switch.Root");

export function useSwitchRoot(props: SwitchRootStateProps) {
	return setSwitchRootContext(new SwitchRootState(props));
}

export function useSwitchInput(): SwitchInputState {
	return getSwitchRootContext().createInput();
}

export function useSwitchThumb(props: SwitchThumbStateProps): SwitchThumbState {
	return getSwitchRootContext().createThumb(props);
}