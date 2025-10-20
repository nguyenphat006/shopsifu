"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2, Package, AlertCircle, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Define default specifications that all products should have
const DEFAULT_SPECIFICATIONS = [
  { id: 'origin', name: 'Xuất xứ', value: '', required: true, icon: '🌍' },
  { id: 'material', name: 'Chất liệu', value: '', required: true, icon: '🧱' },
  { id: 'warehouse', name: 'Kho hàng', value: '', required: true, icon: '🏪' },
  { id: 'stockLocation', name: 'Vị trí kho', value: '', required: true, icon: '📍' },
  { id: 'shipping', name: 'Gửi từ', value: '', required: true, icon: '📦' },
  { id: 'warranty', name: 'Bảo hành', value: '', required: false, icon: '🛡️' },
];

interface Specification {
  name: string;
  value: string;
  id?: string;
  required?: boolean;
  icon?: string;
}

interface ProductSpecificationsFormProps {
  specifications: Specification[];
  handleSpecificationsChange: (specs: Specification[]) => void;
}

export function ProductSpecificationsForm({ specifications, handleSpecificationsChange }: ProductSpecificationsFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isExpanded, setIsExpanded] = useState(true);

  // Initialize specifications with defaults if empty
  const initializeSpecs = () => {
    // Always start with all default specifications
    const mergedSpecs: Specification[] = [];
    
    // First, add all default specifications (required and optional)
    DEFAULT_SPECIFICATIONS.forEach(defaultSpec => {
      // Look for matching spec by name in existing data
      const matchingSpec = specifications?.find(spec => 
        spec.name === defaultSpec.name
      );
      
      // Use existing value if found, otherwise use empty string
      mergedSpecs.push({
        ...defaultSpec,
        value: matchingSpec?.value || '',
      });
    });
    
    // Then, add any custom specifications that don't match defaults
    if (specifications && specifications.length > 0) {
      specifications.forEach(spec => {
        const isDefaultSpec = DEFAULT_SPECIFICATIONS.some(defaultSpec => 
          defaultSpec.name === spec.name
        );
        
        if (!isDefaultSpec && spec.name.trim()) {
          // This is a custom spec, add to the list
          mergedSpecs.push({
            name: spec.name,
            value: spec.value || '',
            required: false,
            icon: spec.icon || '🔧'
          });
        }
      });
    }
    
    // Only update if the current specifications are different
    const currentSpecsString = JSON.stringify(specifications);
    const mergedSpecsString = JSON.stringify(mergedSpecs);
    
    if (currentSpecsString !== mergedSpecsString) {
      handleSpecificationsChange(mergedSpecs);
    }
  };

  // Initialize specs when component mounts
  useEffect(() => {
    initializeSpecs();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update a specific specification
  const updateSpecification = (index: number, field: 'name' | 'value', newValue: string) => {
    const newSpecs = [...specifications];
    newSpecs[index] = { ...newSpecs[index], [field]: newValue };
    
    // Clear error when user starts typing
    if (errors[`spec-${index}-${field}`]) {
      const newErrors = { ...errors };
      delete newErrors[`spec-${index}-${field}`];
      setErrors(newErrors);
    }
    
    handleSpecificationsChange(newSpecs);
  };

  // Add a new custom specification
  const addSpecification = () => {
    handleSpecificationsChange([
      ...specifications,
      { name: '', value: '', icon: '🔧' }
    ]);
  };

  // Remove a specification (only allow removing custom ones, not defaults)
  const removeSpecification = (index: number) => {
    const specToRemove = specifications[index];
    
    // Don't allow removing default specifications
    if (DEFAULT_SPECIFICATIONS.some(def => def.name === specToRemove.name)) {
      return;
    }
    
    const newSpecs = specifications.filter((_, i) => i !== index);
    handleSpecificationsChange(newSpecs);
  };

  // Validate specifications before form submission
  const validateSpecifications = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    specifications.forEach((spec, index) => {
      // Check if this is a required field (all default fields that are required)
      const defaultSpec = DEFAULT_SPECIFICATIONS.find(def => def.name === spec.name);
      const isRequired = defaultSpec?.required || false;

      if (isRequired) {
        // Validate name
        if (!spec.name.trim()) {
          newErrors[`spec-${index}-name`] = 'Tên thuộc tính không được để trống';
          isValid = false;
        }
        
        // Validate value
        if (!spec.value.trim()) {
          newErrors[`spec-${index}-value`] = 'Giá trị không được để trống';
          isValid = false;
        }
      } 
      // For custom fields, if name is filled, value must be filled too
      else if (spec.name.trim() && !spec.value.trim()) {
        newErrors[`spec-${index}-value`] = 'Giá trị không được để trống khi có tên thuộc tính';
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  // Get error message for a field
  const getErrorMessage = (index: number, field: 'name' | 'value'): string => {
    return errors[`spec-${index}-${field}`] || '';
  };

  // Check if a field has an error
  const hasError = (index: number, field: 'name' | 'value'): boolean => {
    return !!errors[`spec-${index}-${field}`];
  };

  // Check if a specification is a default one
  const isDefaultSpecification = (spec: Specification): boolean => {
    return DEFAULT_SPECIFICATIONS.some(defaultSpec => defaultSpec.name === spec.name);
  };

  // Get required specifications (always show all default required specs)
  const getRequiredSpecifications = () => {
    return specifications.filter(spec => {
      const defaultSpec = DEFAULT_SPECIFICATIONS.find(def => def.name === spec.name);
      return defaultSpec?.required || false;
    });
  };

  // Get optional specifications (default optional + custom specs)
  const getOptionalSpecifications = () => {
    return specifications.filter(spec => {
      const defaultSpec = DEFAULT_SPECIFICATIONS.find(def => def.name === spec.name);
      // Include if it's a default optional spec OR if it's not a default spec at all (custom)
      return defaultSpec ? !defaultSpec.required : true;
    });
  };

  // Count filled specifications
  const filledSpecs = specifications.filter(spec => spec.value.trim()).length;
  const requiredSpecs = specifications.filter(spec => {
    const defaultSpec = DEFAULT_SPECIFICATIONS.find(def => def.name === spec.name);
    return defaultSpec?.required || false;
  }).length;

  return (
    <Card className="border border-gray-200 hover:border-gray-300 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Package className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-lg font-semibold text-gray-900">
              Thông số kỹ thuật sản phẩm
            </CardTitle>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
              {filledSpecs}/{specifications.length} đã điền
            </span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-gray-400 hover:text-gray-600"
            >
              {isExpanded ? '−' : '+'}
            </Button>
          </div>
        </div>
        <CardDescription className="text-gray-600">
          Cung cấp thông tin chi tiết về sản phẩm để khách hàng có thể đưa ra quyết định mua hàng tốt nhất
        </CardDescription>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="space-y-4">
          {/* Progress indicator */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Tiến độ hoàn thành</span>
              <span className="text-sm text-gray-500">{Math.round((filledSpecs / specifications.length) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(filledSpecs / specifications.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Alert to show validation errors */}
          {Object.keys(errors).length > 0 && (
            <Alert variant="destructive" className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700">
                Vui lòng điền đầy đủ thông tin cho các trường bắt buộc (đánh dấu *)
              </AlertDescription>
            </Alert>
          )}

          {/* Required specifications section */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2 mb-3">
              <div className="h-1 w-8 bg-red-500 rounded"></div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                Thông tin bắt buộc
              </h3>
            </div>
            
            {getRequiredSpecifications().map((spec) => {
              const index = specifications.findIndex(s => s === spec);
              const defaultSpec = DEFAULT_SPECIFICATIONS.find(def => def.name === spec.name);
              
              return (
                <div key={`required-${index}`} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`spec-name-${index}`} className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                        <span>{defaultSpec?.icon}</span>
                        <span>{spec.name}</span>
                        <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id={`spec-name-${index}`}
                        value={spec.name}
                        disabled
                        className="mt-1 bg-gray-50 text-gray-500 cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`spec-value-${index}`} className="text-sm font-medium text-gray-700">
                        Giá trị <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id={`spec-value-${index}`}
                        value={spec.value}
                        onChange={(e) => updateSpecification(index, 'value', e.target.value)}
                        placeholder={`Nhập ${spec.name.toLowerCase()}`}
                        className={`mt-1 ${hasError(index, 'value') ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'focus:border-blue-500 focus:ring-blue-500'}`}
                      />
                      {hasError(index, 'value') && (
                        <p className="text-red-600 text-xs mt-1 flex items-center">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {getErrorMessage(index, 'value')}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Optional specifications section */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2 mb-3">
              <div className="h-1 w-8 bg-blue-500 rounded"></div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                Thông tin tùy chọn
              </h3>
            </div>

            {getOptionalSpecifications().map((spec) => {
              const index = specifications.findIndex(s => s === spec);
              const isDefault = isDefaultSpecification(spec);
              
              return (
                <div key={`optional-${index}`} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`spec-name-${index}`} className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                        {spec.icon && <span>{spec.icon}</span>}
                        <span>{isDefault ? spec.name : 'Tên thuộc tính'}</span>
                      </Label>
                      {isDefault ? (
                        <Input
                          id={`spec-name-${index}`}
                          value={spec.name}
                          disabled
                          className="mt-1 bg-gray-50 text-gray-500 cursor-not-allowed"
                        />
                      ) : (
                        <Input
                          id={`spec-name-${index}`}
                          value={spec.name}
                          onChange={(e) => updateSpecification(index, 'name', e.target.value)}
                          placeholder="VD: Kích thước, Màu sắc, Trọng lượng..."
                          className={`mt-1 ${hasError(index, 'name') ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'focus:border-blue-500 focus:ring-blue-500'}`}
                        />
                      )}
                      {hasError(index, 'name') && (
                        <p className="text-red-600 text-xs mt-1 flex items-center">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {getErrorMessage(index, 'name')}
                        </p>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor={`spec-value-${index}`} className="text-sm font-medium text-gray-700">
                          Giá trị
                        </Label>
                        {!isDefault && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeSpecification(index)}
                            className="text-red-500 hover:text-red-600 hover:bg-red-50 p-1 h-auto"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <Input
                        id={`spec-value-${index}`}
                        value={spec.value}
                        onChange={(e) => updateSpecification(index, 'value', e.target.value)}
                        placeholder={`Nhập ${spec.name || 'giá trị'}`}
                        className={`mt-1 ${hasError(index, 'value') ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'focus:border-blue-500 focus:ring-blue-500'}`}
                      />
                      {hasError(index, 'value') && (
                        <p className="text-red-600 text-xs mt-1 flex items-center">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {getErrorMessage(index, 'value')}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Add custom specification button */}
          <div className="pt-4 border-t border-gray-100">
            <Button
              type="button"
              variant="outline"
              className="w-full border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50 text-gray-600 hover:text-blue-600 py-6 transition-colors"
              onClick={addSpecification}
            >
              <PlusCircle className="mr-2 h-5 w-5" />
              <span className="font-medium">Thêm thuộc tính tùy chỉnh</span>
            </Button>
          </div>

          {/* Info tip */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-blue-700">
                <p className="font-medium mb-1">Mẹo:</p>
                <p>Thông tin chi tiết và chính xác giúp khách hàng tin tưởng và dễ dàng tìm thấy sản phẩm của bạn hơn.</p>
              </div>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}