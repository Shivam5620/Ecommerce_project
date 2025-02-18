import { Button, Label, Modal, Select, Spinner } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchProductBrands } from "../../app/feature/productSlice";
import { fetchAddBrand } from "../../app/feature/brandSlice";
import { AiOutlineCloudUpload } from "react-icons/ai";

interface IProps {
  show: boolean;
  onClose: () => void;
}

const BrandModal: React.FC<IProps> = ({ show, onClose }) => {
  const dispatch = useAppDispatch();
  const productBrands = useAppSelector((state) => state.products.brands);
  const loading = useAppSelector((state) => state.brands.loading);
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    dispatch(fetchProductBrands({}));
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      // Generate a preview of the selected image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (formRef.current === null) return;
    const formData = new FormData(formRef.current);
    formData.append("image", file as Blob);
    dispatch(fetchAddBrand(formData))
      .unwrap()
      .then((res) => {
        if (res.status) {
          setImagePreview(null);
          setFile(null);

          formRef.current?.reset();
          onClose();
        }
      });
  };

  return (
    <Modal className="bg-[#00000080]" show={show} onClose={onClose}>
      <Modal.Header>Brands </Modal.Header>
      <form encType="multipart/form-data" onSubmit={handleSubmit} ref={formRef}>
        <Modal.Body>
          <div className="card-title">
            <p className="font-normal text-[#76838f] text-[0.875rem] mb-3">
              You can upload Brands images here
            </p>
          </div>
          <div className="flex w-full items-center justify-center mb-3">
            {imagePreview ? (
              // Render the image preview if an image is selected
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Selected Preview"
                  className="h-64 w-full object-contain border"
                />
                <Button
                  type="button"
                  className="absolute top-0 right-0  text-white p-0 rounded-full"
                  size="sm"
                  pill
                  onClick={() => {
                    setImagePreview(null);
                    setFile(null);
                  }}
                >
                  X
                </Button>
              </div>
            ) : (
              // Render the upload area if no image is selected
              <Label
                htmlFor="file-upload"
                className="flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
              >
                <div className="flex flex-col items-center justify-center pb-6 pt-5">
                  <AiOutlineCloudUpload className="mb-4 h-8 w-8 text-gray-500 dark:text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    SVG, PNG, JPG or GIF (MAX. 800x400px)
                  </p>
                </div>
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  name="image"
                  className="hidden"
                  onChange={handleFileChange}
                  required
                />
              </Label>
            )}
          </div>

          <div className="mb-3">
            <Label
              htmlFor="existingBrand"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Existing Brand
            </Label>
            <Select id="existingBrand" className="w-full" name="name" required>
              {productBrands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </Select>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button type="submit" className="bg-[#0071AB]" disabled={loading}>
            {loading ? <Spinner /> : "Submit"}
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default BrandModal;
