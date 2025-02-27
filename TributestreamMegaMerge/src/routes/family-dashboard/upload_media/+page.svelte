<script lang="ts">
    import { masterStore } from '$lib/stores/userStore';
    import { Button } from "$lib/components/ui/button";
    import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "$lib/components/ui/card";
    import { page } from '$app/stores';
    
    // Subscribe to the store using derived
    const store = $derived($masterStore);
    
    // Get JWT token from cookies
    const token = $derived($page.data.token);
    
    // File upload state
    let files: FileList | null = null;
    let uploading = $state(false);
    let uploadProgress = $state(0);
    let error = $state<string | null>(null);
    let success = $state<string | null>(null);

    // Handle file selection
    function handleFileSelect(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            files = input.files;
            error = null;
        }
    }

    // Handle file drop
    function handleDrop(event: DragEvent) {
        event.preventDefault();
        if (event.dataTransfer?.files) {
            files = event.dataTransfer.files;
            error = null;
        }
    }

    // Prevent default drag behavior
    function handleDragOver(event: DragEvent) {
        event.preventDefault();
    }

    // Upload files
    async function uploadFiles() {
        if (!files || files.length === 0) {
            error = "Please select files to upload";
            return;
        }

        if (!token) {
            error = "Authentication required";
            window.location.href = '/login';
            return;
        }

        uploading = true;
        error = null;
        success = null;
        uploadProgress = 0;

        try {
            const formData = new FormData();
            Array.from(files).forEach(file => {
                formData.append('files[]', file);
            });

            const response = await fetch('/api/upload-media', {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Upload failed');
            }

            const result = await response.json();
            success = "Files uploaded successfully!";
            files = null;
            // Reset file input
            const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
            if (fileInput) fileInput.value = '';
        } catch (err) {
            error = err instanceof Error ? err.message : 'An error occurred during upload';
        } finally {
            uploading = false;
            uploadProgress = 0;
        }
    }
</script>

<div class="container mx-auto px-4 py-8">
    <Card class="w-full max-w-2xl mx-auto">
        <CardHeader>
            <CardTitle>Upload Media</CardTitle>
            <CardDescription>
                Upload photos and videos to share in the memorial service.
                Supported formats: JPG, PNG, MP4, MOV
            </CardDescription>
        </CardHeader>

        <CardContent>
            <!-- Drag and drop area -->
            <div
                class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
                on:dragover={handleDragOver}
                on:drop={handleDrop}
            >
                <div class="space-y-4">
                    <div class="text-4xl text-gray-400">
                        📁
                    </div>
                    <p class="text-gray-600">
                        Drag and drop files here or click to select
                    </p>
                    <input
                        type="file"
                        multiple
                        accept="image/*,video/*"
                        class="hidden"
                        on:change={handleFileSelect}
                        id="fileInput"
                    />
                    <Button
                        variant="outline"
                        on:click={() => document.getElementById('fileInput')?.click()}
                    >
                        Select Files
                    </Button>
                </div>
            </div>

            <!-- File list -->
            {#if files && files.length > 0}
                <div class="mt-4 space-y-2">
                    <h3 class="font-semibold">Selected Files:</h3>
                    <ul class="list-disc pl-5">
                        {#each Array.from(files) as file}
                            <li>{file.name} ({Math.round(file.size / 1024)}KB)</li>
                        {/each}
                    </ul>
                </div>
            {/if}

            <!-- Progress bar -->
            {#if uploading}
                <div class="mt-4">
                    <div class="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                            class="bg-primary h-2.5 rounded-full transition-all duration-300"
                            style="width: {uploadProgress}%"
                        ></div>
                    </div>
                    <p class="text-sm text-gray-600 mt-1">Uploading... {uploadProgress}%</p>
                </div>
            {/if}

            <!-- Error message -->
            {#if error}
                <div class="mt-4 p-4 bg-red-50 text-red-700 rounded-lg">
                    {error}
                </div>
            {/if}

            <!-- Success message -->
            {#if success}
                <div class="mt-4 p-4 bg-green-50 text-green-700 rounded-lg">
                    {success}
                </div>
            {/if}
        </CardContent>

        <CardFooter class="flex justify-between">
            <a href="/family-dashboard" class="inline-block">
                <Button variant="outline">
                    Back
                </Button>
            </a>
            <Button
                on:click={uploadFiles}
                disabled={!files || files.length === 0 || uploading}
            >
                {uploading ? 'Uploading...' : 'Upload Files'}
            </Button>
        </CardFooter>
    </Card>
</div>