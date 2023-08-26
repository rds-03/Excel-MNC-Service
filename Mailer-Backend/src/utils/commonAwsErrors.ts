interface awsError {
	isAwsError: boolean;
	message: string;
}

export function isAwsError(error: any): awsError {
	if (!error) {
		return {
			isAwsError: false,
			message: 'No error object passed',
		};
	}

	if (!error.name) {
		return {
			isAwsError: false,
			message: 'No error name found',
		};
	}

	if (!error.message) {
		return {
			isAwsError: false,
			message: 'No error message found',
		};
	}

	switch (error.name) {
		case 'InvalidParameterValue':
			return {
				isAwsError: true,
				message: error.message,
			};

		// TODO: Add more cases here
	}

	return {
		isAwsError: false,
		message: 'Error name not Matched',
	};
}
