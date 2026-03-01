import { supabase } from './supabaseClient';

/**
 * Uploads a file to a Supabase storage bucket and returns the public URL.
 * @param file The file to upload
 * @param bucket The name of the bucket (default: 'foundation')
 * @returns The public URL of the uploaded image
 */
export const uploadImage = async (file: File, bucket: string = 'foundation') => {
    try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}-${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from(bucket)
            .upload(filePath, file);

        if (uploadError) {
            if ((uploadError as any).message?.includes('Bucket not found')) {
                throw new Error('Supabase Storage Bucket "foundation" was not found. Please create it in your Supabase Dashboard as instructed.');
            }
            throw uploadError;
        }


        const { data: { publicUrl } } = supabase.storage
            .from(bucket)
            .getPublicUrl(filePath);

        return publicUrl;
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
};
