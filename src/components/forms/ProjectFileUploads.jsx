'use client';

import FileUpload from './FileUpload';

/**
 * ProjectFileUploads Component
 * Manages all file upload fields for a project
 * Files with priority: hideLevel, modelsFiles, supportFiles, roomSnaps, _360sImages
 * Files without priority: constructionDrawings, presentationDrawings
 *
 * Files are automatically uploaded to Firebase Storage at:
 * ppsbluyari/{projectTitle}/{fileName}
 */
export default function ProjectFileUploads({
  fileStates,
  onFileStatesChange,
  onSaveField,
  projectTitle = 'untitled',
  disabled = false,
  savedFields = {}
}) {
  const {
    hideLevel = [],
    modelsFiles = [],
    supportFiles = [],
    roomSnaps = [],
    _360sImages = [],
    renders = [],
    drawings = [],
    constructionDrawings = [],
    presentationDrawings = []
  } = fileStates;

  const updateFiles = (field, filesOrUpdater) => {
    // Handle both direct value and callback function patterns
    const currentFiles = fileStates[field] || [];
    const newFiles = typeof filesOrUpdater === 'function'
      ? filesOrUpdater(currentFiles)
      : filesOrUpdater;

    onFileStatesChange({
      ...fileStates,
      [field]: newFiles
    });
  };

  // Create save handler for a specific field
  const createSaveHandler = (field) => async (files) => {
    if (onSaveField) {
      // Update the file states and trigger save
      onFileStatesChange({
        ...fileStates,
        [field]: files.map(f => ({ ...f, pendingSave: false }))
      });
      await onSaveField(field, files);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4 text-gray-700">File Uploads</h2>
      <p className="text-sm text-gray-500 mb-4">
        Files are automatically uploaded to Firebase Storage under: <code className="bg-gray-100 px-1 rounded">bonnohousing/houses/{projectTitle || 'untitled'}/</code>
      </p>

      <div className="space-y-4">
        {/* Files with Priority - 3D Model Files */}
        <FileUpload
          label="Hide Level Files"
          files={hideLevel}
          setFiles={(files) => updateFiles('hideLevel', files)}
          isImage={false}
          withPriority={true}
          accept=".fbx,.glb,.gltf"
          disabled={disabled}
          projectTitle={projectTitle}
          fieldName="hideLevel"
          onSaveToDatabase={createSaveHandler('hideLevel')}
          savedToDatabase={savedFields.hideLevel}
        />

        <FileUpload
          label="3D Model Files"
          files={modelsFiles}
          setFiles={(files) => updateFiles('modelsFiles', files)}
          isImage={false}
          withPriority={true}
          accept=".fbx,.glb,.gltf"
          disabled={disabled}
          projectTitle={projectTitle}
          fieldName="modelsFiles"
          onSaveToDatabase={createSaveHandler('modelsFiles')}
          savedToDatabase={savedFields.modelsFiles}
        />

        <FileUpload
          label="Support Files"
          files={supportFiles}
          setFiles={(files) => updateFiles('supportFiles', files)}
          isImage={false}
          withPriority={true}
          accept=".fbx,.glb,.gltf"
          disabled={disabled}
          projectTitle={projectTitle}
          fieldName="supportFiles"
          onSaveToDatabase={createSaveHandler('supportFiles')}
          savedToDatabase={savedFields.supportFiles}
        />

        <FileUpload
          label="Room Snaps"
          files={roomSnaps}
          setFiles={(files) => updateFiles('roomSnaps', files)}
          isImage={false}
          withPriority={true}
          accept=".fbx,.glb,.gltf"
          disabled={disabled}
          projectTitle={projectTitle}
          fieldName="roomSnaps"
          onSaveToDatabase={createSaveHandler('roomSnaps')}
          savedToDatabase={savedFields.roomSnaps}
        />

        {/* Image files with Priority */}
        <FileUpload
          label="360° Images"
          files={_360sImages}
          setFiles={(files) => updateFiles('_360sImages', files)}
          isImage={true}
          withPriority={true}
          accept=".jpg,.jpeg,.png,.webp"
          disabled={disabled}
          projectTitle={projectTitle}
          fieldName="_360sImages"
          onSaveToDatabase={createSaveHandler('_360sImages')}
          savedToDatabase={savedFields._360sImages}
        />

        <FileUpload
          label="Renders"
          files={renders}
          setFiles={(files) => updateFiles('renders', files)}
          isImage={true}
          withPriority={true}
          accept=".jpg,.jpeg,.png,.webp"
          disabled={disabled}
          projectTitle={projectTitle}
          fieldName="renders"
          onSaveToDatabase={createSaveHandler('renders')}
          savedToDatabase={savedFields.renders}
        />

        <FileUpload
          label="Drawings"
          files={drawings}
          setFiles={(files) => updateFiles('drawings', files)}
          isImage={true}
          withPriority={true}
          withDescription={true}
          accept=".jpg,.jpeg,.png,.webp"
          disabled={disabled}
          projectTitle={projectTitle}
          fieldName="drawings"
          onSaveToDatabase={createSaveHandler('drawings')}
          savedToDatabase={savedFields.drawings}
        />

        {/* PDF Files without Priority */}
        <FileUpload
          label="Construction Drawings"
          files={constructionDrawings}
          setFiles={(files) => updateFiles('constructionDrawings', files)}
          isImage={false}
          withPriority={false}
          accept=".pdf"
          disabled={disabled}
          projectTitle={projectTitle}
          fieldName="constructionDrawings"
          onSaveToDatabase={createSaveHandler('constructionDrawings')}
          savedToDatabase={savedFields.constructionDrawings}
        />

        <FileUpload
          label="Presentation Drawings"
          files={presentationDrawings}
          setFiles={(files) => updateFiles('presentationDrawings', files)}
          isImage={false}
          withPriority={false}
          accept=".pdf"
          disabled={disabled}
          projectTitle={projectTitle}
          fieldName="presentationDrawings"
          onSaveToDatabase={createSaveHandler('presentationDrawings')}
          savedToDatabase={savedFields.presentationDrawings}
        />
      </div>
    </div>
  );
}

