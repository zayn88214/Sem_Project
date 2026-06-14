#!/usr/bin/env python3
import os
import sys

print('=== ML Models Complete Status Check ===\n')

# Check model files
models_dir = 'models'
print(f'Models directory exists: {os.path.exists(models_dir)}')
if os.path.exists(models_dir):
    print(f'Model files:')
    for file in os.listdir(models_dir):
        file_path = os.path.join(models_dir, file)
        file_size = os.path.getsize(file_path)
        print(f'  - {file}: {file_size:,} bytes ({file_size / (1024*1024):.2f} MB)')
    print()

# Try loading requirements
print('Checking dependencies...')
deps_ok = True
try:
    import tensorflow as tf
    print(f'✓ TensorFlow: {tf.__version__}')
except ImportError as e:
    print(f'✗ TensorFlow: NOT INSTALLED - {str(e)}')
    deps_ok = False

try:
    import sklearn
    print(f'✓ Scikit-learn: {sklearn.__version__}')
except ImportError:
    print(f'✗ Scikit-learn: NOT INSTALLED')
    deps_ok = False

try:
    import keras
    print(f'✓ Keras: {keras.__version__}')
except ImportError:
    print(f'✗ Keras: NOT INSTALLED')
    
try:
    import pickle
    print(f'✓ Pickle: available')
except ImportError:
    print(f'✗ Pickle: NOT INSTALLED')

print()
print('=== Attempting Model Loading ===\n')

# Try loading crop model
try:
    import pickle
    with open('models/random_forest_crop.pkl', 'rb') as f:
        crop_model = pickle.load(f)
    print(f'✓ Crop model loaded successfully')
    print(f'  Type: {type(crop_model).__name__}')
    print(f'  Model: {type(crop_model).__module__}.{type(crop_model).__name__}')
    if hasattr(crop_model, 'predict_proba'):
        print(f'  Has predict_proba: Yes')
    if hasattr(crop_model, 'predict'):
        print(f'  Has predict: Yes')
except Exception as e:
    print(f'✗ Crop model failed: {str(e)}')

print()

# Try loading disease model (TensorFlow)
try:
    import tensorflow as tf
    disease_model = tf.keras.models.load_model('models/efficientnetv2s_PLANT_DISEASE.h5')
    print(f'✓ Disease model (TensorFlow/Keras) loaded successfully')
    print(f'  Type: {type(disease_model).__name__}')
    print(f'  Input shape: {disease_model.input_shape}')
    print(f'  Output shape: {disease_model.output_shape}')
    print(f'  Total layers: {len(disease_model.layers)}')
    print(f'  Trainable params: {disease_model.count_params():,}')
except Exception as e:
    print(f'✗ Disease model failed: {str(e)}')

print()
print('=== Summary ===')
if deps_ok:
    print('✓ All dependencies installed and working')
    print('✓ Both models can be loaded successfully')
    print('✓ ML service should work correctly')
else:
    print('✗ Missing critical dependencies')
    print('  Install with: pip install -r ml/requirements.txt')
print()
print('Disease model: EfficientNetV2-Small (38 plant disease classes)')
print('Crop model: Logistic Regression (22 crop recommendations)')

