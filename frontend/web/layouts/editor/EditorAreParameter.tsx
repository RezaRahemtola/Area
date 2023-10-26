import { AreaParameterWithValue } from "@/types/services";

type EditorAreaParameterProps = {
	parameter: AreaParameterWithValue;
	onValueChange: (parameterName: string, value: never) => void;
};

const EditorAreaParameterInput = ({ parameter, onValueChange }: EditorAreaParameterProps) => {
	if (parameter.type === "integer") {
		return (
			<input
				type="number"
				className="input bg-neutral input-accent"
				value={parameter.value ?? 0}
				onChange={(e) => onValueChange(parameter.name, e.target.value as never)}
			/>
		);
	}
	if (["short-text", "long-text", "text-array"].includes(parameter.type)) {
		return (
			<input
				type="text"
				className="input bg-neutral input-accent"
				value={parameter.value ?? ""}
				onChange={(e) => onValueChange(parameter.name, e.target.value as never)}
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
