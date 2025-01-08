
import { useEffect, useState } from "react";
import { z } from "zod";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { ApplicationSchema, FieldsSchema, OAuthLoginSchema } from "../libs/schema";
import { getApplicationByUUId, getCustomFields, getFields, getOAuths } from "../libs/queries";
import logo from '../assets/es2logoblack.png'
import { getEnvVariable } from "../libs/envUtils";
import sww from '../../src/assets/sww.png'
import envE from '../../src/assets/envnotfound.png'


type AppDataType = z.infer<typeof ApplicationSchema>;
type FiledDataType = z.infer<typeof FieldsSchema>;
type OAuthDataType = z.infer<typeof OAuthLoginSchema>;



export function E2SAuth() {
    const [showPassword, setShowPassword] = useState(false);
    const [isSignIn, setIsSignIn] = useState(true)
    const [formValues, setFormValues] = useState({});


    const [appData, setAppData] = useState<AppDataType | null>(null);
    const [oAuthData, setOAuthData] = useState<OAuthDataType[]>([]);
    const [signInData, setSignInData] = useState<FiledDataType[]>([]);
    const [signUpData, setSignUpData] = useState<FiledDataType[]>([]);

    const [envError, setEnvError] = useState(false);
    const [dataError, setDataError] = useState(false);
    const [appId, setAppId] = useState<string | undefined>(undefined);
  const [userID, setUserID] = useState<string | undefined>(undefined);

  useEffect(() => {
    const appIdFromEnv = getEnvVariable("APPLICATION_PUBLISHABLE_KEY");
    const userIDFromEnv = getEnvVariable("E2SAUTH_SECRET_KEY");

    if (appIdFromEnv && userIDFromEnv) {
      setAppId(appIdFromEnv);
      setUserID(userIDFromEnv);
    } else {
        setEnvError(true);
    }
  }, []);

    useEffect(() => {
        console.log("appId ", appId)
        if (!appId || !userID) {
            setEnvError(true);
            return;
        }
        const fetchApplication = async () => {
            try {
                setEnvError(false);
                setDataError(false)
                const applicationData = await getApplicationByUUId(appId);
                if (!applicationData) {
                    throw new Error("Failed to fetch application data. Response is empty or undefined.");
                }

                setAppData(applicationData)
                const customFields = await getCustomFields(userID);
                const allFields = await getFields();
                const allOAuthFields = await getOAuths();

                // Extract field IDs from application data

                // Filter fields by IDs
                const filteredOAuthFields = allOAuthFields.filter((item: { id: string }) => applicationData['oauthFields'].includes(item.id));
                const filteredSignInFields = allFields.filter((item: { id: string }) => applicationData['signInFields'].includes(item.id));

                const filteredSignUpFields = allFields?.filter((item: { id: string }) => applicationData['signUpFields'].includes(item.id));
                const filteredCustomFields = customFields?.filter((item: { id: string }) => applicationData['customFields'].includes(item.id));


                const combinedArray = [...filteredSignUpFields, ...filteredCustomFields];
                setOAuthData(filteredOAuthFields)
                setSignInData(filteredSignInFields)
                setSignUpData(combinedArray)

                setEnvError(false);
                setDataError(false)
            } catch (error) {
                setDataError(true)
                console.error("Error fetching application data:", error);
            }
        };
        fetchApplication()
    }, [appId, userID])

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const handleinputChange = (e: { target: { name: string; value: string; }; }) => {
        const { name, value } = e.target;
        setFormValues(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = () => {
        console.log('Form Values:', formValues);
    };
    const handleSubmitSIgnIn = () => {
        console.log('handleSubmitSIgnIn Form Values:', formValues);
    };
    if (envError) {
        return <div className="flex flex-col items-center justify-center w-screen h-screen bg-white">
            <img src={envE} />
            <p>We did not find any key, <a href={`https://e2shub.com/agency`} className="text-blue-500 underline">click here</a> to get your keys.</p>
        </div>;
    }
    if (dataError) {
        return <div className="flex flex-col items-center justify-center w-screen h-screen bg-white">
            <img src={sww} />
            <p>Something went wrong, Please try againg after some time.</p>
        </div>;
    }

    return (
        <div className="flex items-center justify-center w-full h-screen bg-gray-100">
            <div className="bg-white shadow-lg rounded-2xl flex w-[28rem] relative">
                {/* Left Side: Logo and Company Name */}
                <div className="flex flex-row items-center justify-center w-full gap-4 py-3 text-white bg-gradient-to-b from-indigo-500 to-purple-300 md:w-20 md:flex-col rounded-t-2xl md:py-0 md:rounded-l-2xl md:rounded-none">
                    <p className="mb-0 text-sm font-bold tracking-wide text-center md:mb-6 md:-rotate-90">E2S-AUTH</p>
                    <img src={logo} width={40} height={40} alt="logo" className="mb-0 md:mb-4 md:-rotate-90 rounded-xl" />
                </div>

                {/* Right Side: Login Form */}
                <div className="flex flex-col items-center flex-1 p-6 pb-1">
                    {/* Logo on Top */}
                    <div className="flex flex-col items-center justify-center mb-6">
                        <img src={appData?.customLogoUrl || undefined} width={60} height={60} alt="logo" />
                        <h1 className="mt-2 text-xl font-semibold text-gray-700">{appData?.name}</h1>
                    </div>

                    {/* Login Header */}
                    {isSignIn ? (
                        <div>
                            <div className="mb-4 text-center">
                                <h2 className="text-lg font-semibold text-gray-800">{appData?.customHeading ? appData?.customHeading : "Sign in to your Account"}</h2>
                                <p className="text-sm text-gray-500">{appData?.customDescription ? appData?.customDescription : "Enter your email and password to continue"}</p>
                            </div>

                            {/* Render Input Fields */}
<div className="w-full space-y-4">
    {signInData?.map((field, index) => {
        // Safeguard for undefined fields
        const fieldType = field?.fieldType?.toLowerCase() || 'text';
        const fieldName = field?.fieldName || `field_${index}`;
        const placeHolder = field?.placeHolder || `Enter ${fieldName}`;

        return (
            <div
                key={fieldName}
                className={fieldType === 'password' ? 'relative' : ''}
            >
                {fieldType === 'password' ? (
                    <>
                        <input
                            type={showPassword ? 'text' : fieldType}
                            name={fieldName}
                            placeholder={placeHolder}
                            className="w-full px-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            onChange={handleinputChange}
                        />
                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute text-gray-500 right-3 top-2"
                        >
                            {showPassword ? <FaEye /> : <FaEyeSlash />}
                        </button>
                    </>
                ) : (
                    <input
                        type={fieldType === 'email' ? 'email' : 'text'}
                        name={fieldName}
                        placeholder={placeHolder}
                        className="w-full px-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        onChange={handleinputChange}
                    />
                )}
            </div>
        );
    })}
</div>


                            <div className="w-full mt-6">
                                <button
                                    type="button"
                                    onClick={handleSubmitSIgnIn}
                                    className="w-full py-2 text-sm font-medium text-white transition duration-200 bg-indigo-500 rounded-md hover:bg-indigo-600"
                                >
                                    SIGN IN
                                </button>
                            </div>
                            <div className="flex flex-col w-full gap-1 mt-2">
                                {oAuthData?.map((item) => (
                                    <button className="w-full text-sm font-medium border rounded-md">
                                        <span><img src={item.logoURL || ''} alt='field logo' />{item.fieldName}</span>
                                    </button>

                                ))}
                            </div>
                        </div>
                    ) : (
                        <div>
                            <div className="mb-4 text-center">
                                <h2 className="text-lg font-semibold text-gray-800">
                                    {appData?.customHeading || 'Sign in to your Account'}
                                </h2>
                                <p className="text-sm text-gray-500">
                                    {appData?.customDescription || 'Enter your email and password to continue'}
                                </p>
                            </div>

                            {/* input Fields */}
                            <div className="w-full space-y-4">
                            {signUpData?.map((field, index) => {
    const fieldType = field?.fieldType?.toLowerCase() || 'text';
    const fieldName = field?.fieldName || `signup_field_${index}`;
    const placeHolder = field?.placeHolder || `Enter ${fieldName}`;

    return (
        <div
            key={fieldName}
            className={fieldType === 'password' ? 'relative' : ''}
        >
            {fieldType === 'password' ? (
                <>
                    <input
                        type={showPassword ? 'text' : fieldType}
                        name={fieldName}
                        placeholder={placeHolder}
                        className="w-full px-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        onChange={handleinputChange}
                    />
                    <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute text-gray-500 right-3 top-2"
                    >
                        {showPassword ? <FaEye /> : <FaEyeSlash />}
                    </button>
                </>
            ) : (
                <input
                    type={fieldType}
                    name={fieldName}
                    placeholder={placeHolder}
                    className="w-full px-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    onChange={handleinputChange}
                />
            )}
        </div>
    );
})}

                                <div className="flex items-center text-sm text-gray-600">
                                    <input
                                        type="checkbox"
                                        name="rememberMe"
                                        className="mr-2"
                                        onChange={handleinputChange}
                                    />
                                    <span>Remember me</span>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="w-full mt-6">
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    className="w-full py-2 text-sm font-medium text-white transition duration-200 bg-indigo-500 rounded-md hover:bg-indigo-600"
                                >
                                    SIGN UP
                                </button>
                            </div>
                        </div>
                    )}
                    <div className='mt-5 text-center'>
                        {isSignIn ? (
                            <p className='text-sm'>New to us? <strong onClick={() => setIsSignIn(false)} className='underline cursor-pointer'>SIgn Up</strong></p>
                        ) : (
                            <p className='text-sm'>Already a memeber? <strong onClick={() => setIsSignIn(true)} className='underline cursor-pointer'>SIgn In</strong></p>
                        )}
                        <p className='mt-4 text-sm'>powered by <strong className='text-gray-400'>@E2S-AUTH</strong></p>
                    </div>
                </div>
            </div>
        </div>

    )
};


