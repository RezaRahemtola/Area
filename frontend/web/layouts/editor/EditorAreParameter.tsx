import { useEffect, useState } from "react";
import { AreaParameterWithValue } from "@/types/services";

type EditorAreaParameterProps = {
	parameter: AreaParameterWithValue;
	onValueChange: (parameterName: string, value: never) => void;
};

const EditorAreaParameterInput = ({ parameter, onValueChange }: EditorAreaParameterProps) => {
	const [value, setValue] = useState<never | undefined>(parameter.value);

	useEffect(() => {
		if (parameter.value === undefined) {
			if (parameter.type === "boolean") {
				setValue(false as never);
			} else if (parameter.type === "integer") {
				setValue(0 as never);
			}
		}
	}, []);

	useEffect(() => {
		onValueChange(parameter.name, value as never);
	}, [value]);

	if (parameter.type === "integer") {
		return (
			<input
				type="number"
				className="input bg-neutral input-accent"
				value={value}
				onChange={(e) => setValue(e.target.value as never)}
			/>
		);
	}
	if (["email", "short-text", "text-array"].includes(parameter.type)) {
		return (
			<input
				type="text"
				className="input bg-neutral input-accent"
				value={value ?? ""}
				onChange={(e) => setValue(e.target.value as never)}
			/>
		);
	}
	if (parameter.type === "long-text") {
		return (
			<textarea
				className="textarea bg-neutral textarea-accent"
				value={value ?? ""}
				onChange={(e) => setValue(e.target.value as never)}
			/>
		);
	}
	if (parameter.type === "boolean") {
		return (
			<input
				type="checkbox"
				name="workflow-running"
				className="toggle toggle-success"
				checked={value}
				onChange={(e) => setValue(e.target.checked as never)}
			/>
		);
	}
	return <></>;
};

const EditorAreParameter = ({ parameter, onValueChange }: EditorAreaParameterProps) => (
	<>
		<label className="label">
			<span className="label-text text-neutral-content">{parameter.name} </span>
			{parameter.required && <span className="label-text text-red-500">*</span>}
		</label>
		<EditorAreaParameterInput parameter={parameter} onValueChange={onValueChange} />
	</>
);

export default EditorAreParameter;
