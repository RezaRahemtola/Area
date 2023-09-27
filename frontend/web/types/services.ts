// Data type and Fallback in case of error
export type ServiceReturn<T> =
	| {
			data: T;
			error: undefined;
	  }
	| {
			data: null;
			error: string;
	  };
