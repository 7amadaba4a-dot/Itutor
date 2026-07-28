import { defineStore } from 'pinia';
import { getInheritedConfiguration } from '@/_common/helpers/configuration/configuration';
 
/* wwFront:start */
// eslint-disable-next-line no-undef
import plugincabb43dd616141408ebf03b6fb045a0b from '@/components/plugins/plugin-cabb43dd-6161-4140-8ebf-03b6fb045a0b/ww-config.js';
import plugin8bc1b5c929e44269becba2e1a8de9127 from '@/components/plugins/plugin-8bc1b5c9-29e4-4269-becb-a2e1a8de9127/ww-config.js';
import plugin832d6f7a42c343f1a3ce9a678272f811 from '@/components/plugins/plugin-832d6f7a-42c3-43f1-a3ce-9a678272f811/ww-config.js';
import plugin41448d5dae2649bd82b61c79f462e972 from '@/components/plugins/plugin-41448d5d-ae26-49bd-82b6-1c79f462e972/ww-config.js';
import plugin01af5352af714382844b2ec141ff243b from '@/components/plugins/plugin-01af5352-af71-4382-844b-2ec141ff243b/ww-config.js';
import plugincd33cf33e29f4e8cac26b997fe507ce7 from '@/components/plugins/plugin-cd33cf33-e29f-4e8c-ac26-b997fe507ce7/ww-config.js';
import plugind66a250d8468469ead33ee028f632398 from '@/components/plugins/plugin-d66a250d-8468-469e-ad33-ee028f632398/ww-config.js';
import plugin00d22f721a0344f8ad68c593dc80b543 from '@/components/plugins/plugin-00d22f72-1a03-44f8-ad68-c593dc80b543/ww-config.js';
import plugine93a2dfd9b19473eb445c666fed4e14a from '@/components/plugins/plugin-e93a2dfd-9b19-473e-b445-c666fed4e14a/ww-config.js';
import pluginf9ef41c31c534857855bf2f6a40b7186 from '@/components/plugins/plugin-f9ef41c3-1c53-4857-855b-f2f6a40b7186/ww-config.js';
import plugin66a79c9870e74bc4885920776b024ec2 from '@/components/plugins/plugin-66a79c98-70e7-4bc4-8859-20776b024ec2/ww-config.js';
import plugin97e7b1aef88a4697849cee56ab49bb48 from '@/components/plugins/plugin-97e7b1ae-f88a-4697-849c-ee56ab49bb48/ww-config.js';
import pluginf5856798485d47beb433d43d771c64e1 from '@/components/plugins/plugin-f5856798-485d-47be-b433-d43d771c64e1/ww-config.js';
import plugin2bd1c68831c5443eae2559aa5b6431fb from '@/components/plugins/plugin-2bd1c688-31c5-443e-ae25-59aa5b6431fb/ww-config.js';
import plugin6a64802c52f846379932580bf178aaa7 from '@/components/plugins/plugin-6a64802c-52f8-4637-9932-580bf178aaa7/ww-config.js';
import pluginfbf0feec356b461b87383b1f44edaf02 from '@/components/plugins/plugin-fbf0feec-356b-461b-8738-3b1f44edaf02/ww-config.js';
import plugin1506e088e31c49bc83a190a3de4f6db1 from '@/components/plugins/plugin-1506e088-e31c-49bc-83a1-90a3de4f6db1/ww-config.js';
import plugin75b9e021a5fe4ae98c6af4b3e65f2a24 from '@/components/plugins/plugin-75b9e021-a5fe-4ae9-8c6a-f4b3e65f2a24/ww-config.js';
import plugin1c5f5c0f560940319e575bb4811be7b3 from '@/components/plugins/plugin-1c5f5c0f-5609-4031-9e57-5bb4811be7b3/ww-config.js';
import plugin60610cfdfa284fc19e72088b5c667e81 from '@/components/plugins/plugin-60610cfd-fa28-4fc1-9e72-088b5c667e81/ww-config.js';
import plugind7d2c87917834d58a9bb807f065d941e from '@/components/plugins/plugin-d7d2c879-1783-4d58-a9bb-807f065d941e/ww-config.js';
import plugin9c40819b4a8f468f9ba54b9699f3361f from '@/components/plugins/plugin-9c40819b-4a8f-468f-9ba5-4b9699f3361f/ww-config.js';
import section99586bd32b154d6ba0256a50d07ca845 from '@/components/sections/section-99586bd3-2b15-4d6b-a025-6a50d07ca845/ww-config.js';
import sectionef0ecc719a594eab94b0b36d66d3d61d from '@/components/sections/section-ef0ecc71-9a59-4eab-94b0-b36d66d3d61d/ww-config.js';
import wwobjectf002c261daa940cca7caf8f3621ea023 from '@/components/elements/element-f002c261-daa9-40cc-a7ca-f8f3621ea023/ww-config.js';
import wwobjecte4de0cd8732447eea0c3cf4114a9f952 from '@/components/elements/element-e4de0cd8-7324-47ee-a0c3-cf4114a9f952/ww-config.js';
import wwobject6408af414f1948c7822ff2b543859711 from '@/components/elements/element-6408af41-4f19-48c7-822f-f2b543859711/ww-config.js';
import wwobjectcf4a5d687d4d465dbfe691e2f0d9a359 from '@/components/elements/element-cf4a5d68-7d4d-465d-bfe6-91e2f0d9a359/ww-config.js';
import wwobject967a546cd29c490fae27dbfc3e5f1359 from '@/components/elements/element-967a546c-d29c-490f-ae27-dbfc3e5f1359/ww-config.js';
import wwobjectfba0c85afeb7438482fb380b0276169a from '@/components/elements/element-fba0c85a-feb7-4384-82fb-380b0276169a/ww-config.js';
import wwobjectb8e4146c4fb2421fbf8c2cc7e21254cd from '@/components/elements/element-b8e4146c-4fb2-421f-bf8c-2cc7e21254cd/ww-config.js';
import wwobject8bd1da252746431480b94271ee6bd644 from '@/components/elements/element-8bd1da25-2746-4314-80b9-4271ee6bd644/ww-config.js';
import wwobject5e1b9eca971148f09de96610247cae37 from '@/components/elements/element-5e1b9eca-9711-48f0-9de9-6610247cae37/ww-config.js';
import wwobject234b456698ac49cd915ebb00aab2f5c5 from '@/components/elements/element-234b4566-98ac-49cd-915e-bb00aab2f5c5/ww-config.js';
import wwobject21881619a984484781a9922c3dbb5853 from '@/components/elements/element-21881619-a984-4847-81a9-922c3dbb5853/ww-config.js';
import wwobjectaeb78b9a6fb64c49931dfaedcfad67ba from '@/components/elements/element-aeb78b9a-6fb6-4c49-931d-faedcfad67ba/ww-config.js';
import wwobjectfd8c482f532c4aeba7ae6904a6b62a1b from '@/components/elements/element-fd8c482f-532c-4aeb-a7ae-6904a6b62a1b/ww-config.js';
import wwobject99ea5bf7b91e43ea8ec3dbaf2b171e34 from '@/components/elements/element-99ea5bf7-b91e-43ea-8ec3-dbaf2b171e34/ww-config.js';
import wwobject0dc461bb103e4b2e80e0846ec3c30a6e from '@/components/elements/element-0dc461bb-103e-4b2e-80e0-846ec3c30a6e/ww-config.js';
import wwobject0d3e75d19e7744cba2728b0825fbc5da from '@/components/elements/element-0d3e75d1-9e77-44cb-a272-8b0825fbc5da/ww-config.js';
import wwobject69d0b3efb265494c8cd1874da4aa1834 from '@/components/elements/element-69d0b3ef-b265-494c-8cd1-874da4aa1834/ww-config.js';
import wwobject6dee33279afa4b44badebdb547cdb18b from '@/components/elements/element-6dee3327-9afa-4b44-bade-bdb547cdb18b/ww-config.js';
import wwobject83d890fb84f94386b459fb4be89a8e15 from '@/components/elements/element-83d890fb-84f9-4386-b459-fb4be89a8e15/ww-config.js';
import wwobject6ba133b6a444414f93a525cd237dd398 from '@/components/elements/element-6ba133b6-a444-414f-93a5-25cd237dd398/ww-config.js';
import wwobjectaf811adf94d949ddab22e2f29ae30299 from '@/components/elements/element-af811adf-94d9-49dd-ab22-e2f29ae30299/ww-config.js';
import wwobject6f8796b18273498d95fc7013b7c63214 from '@/components/elements/element-6f8796b1-8273-498d-95fc-7013b7c63214/ww-config.js';
import wwobject88ef76b646d54685878f2f1fa0d54cb8 from '@/components/elements/element-88ef76b6-46d5-4685-878f-2f1fa0d54cb8/ww-config.js';
import wwobject3a7d637912d3438798ffb332bb492a63 from '@/components/elements/element-3a7d6379-12d3-4387-98ff-b332bb492a63/ww-config.js';
import wwobject9256b033f4e84ab4adcedac3a940d7f5 from '@/components/elements/element-9256b033-f4e8-4ab4-adce-dac3a940d7f5/ww-config.js';
import wwobject1827b154f2aa4235b3f51d2e19c4b6cc from '@/components/elements/element-1827b154-f2aa-4235-b3f5-1d2e19c4b6cc/ww-config.js';
import wwobject5a88036f22ea4f8db4a5bc226ef95061 from '@/components/elements/element-5a88036f-22ea-4f8d-b4a5-bc226ef95061/ww-config.js';
import wwobject6d692ca26cdc4805aa0c211102f335d0 from '@/components/elements/element-6d692ca2-6cdc-4805-aa0c-211102f335d0/ww-config.js';
import wwobject70a5385853ca40a5ad88c1cd33b5cc9f from '@/components/elements/element-70a53858-53ca-40a5-ad88-c1cd33b5cc9f/ww-config.js';
import wwobject00df911550ec41149a76c96c76721e6f from '@/components/elements/element-00df9115-50ec-4114-9a76-c96c76721e6f/ww-config.js';
import wwobject59dca300db7842e4a7a60cbf22d3cc82 from '@/components/elements/element-59dca300-db78-42e4-a7a6-0cbf22d3cc82/ww-config.js';
import wwobject7179ba70c5d749a59828f85704fd1efc from '@/components/elements/element-7179ba70-c5d7-49a5-9828-f85704fd1efc/ww-config.js';
import wwobject3082cb3f30334e6e82221fba3af145fe from '@/components/elements/element-3082cb3f-3033-4e6e-8222-1fba3af145fe/ww-config.js';
import wwobjecta823467cbdc74ceca38c71875c4c214a from '@/components/elements/element-a823467c-bdc7-4cec-a38c-71875c4c214a/ww-config.js';
import wwobject60676ae599b1427893304299cd99c5cf from '@/components/elements/element-60676ae5-99b1-4278-9330-4299cd99c5cf/ww-config.js';
import wwobject2c8e3e543ea348eab8c8e7580e3362a2 from '@/components/elements/element-2c8e3e54-3ea3-48ea-b8c8-e7580e3362a2/ww-config.js';
import wwobject1ba25bdfdee94e0ea0b8b3f3128c3b65 from '@/components/elements/element-1ba25bdf-dee9-4e0e-a0b8-b3f3128c3b65/ww-config.js';
import wwobject9202d35c281345bca7f30adb85f83e5e from '@/components/elements/element-9202d35c-2813-45bc-a7f3-0adb85f83e5e/ww-config.js';
import wwobject97a634605c254d74ac1f86693c2e4a08 from '@/components/elements/element-97a63460-5c25-4d74-ac1f-86693c2e4a08/ww-config.js';
import wwobject2fd375f8f5c74d81881ddacd40bc0ad3 from '@/components/elements/element-2fd375f8-f5c7-4d81-881d-dacd40bc0ad3/ww-config.js';
import wwobjectf4c24d06bc884b62add34d1f8b42221c from '@/components/elements/element-f4c24d06-bc88-4b62-add3-4d1f8b42221c/ww-config.js';
import wwobjectaa27b26f06864c2998c58217044045b7 from '@/components/elements/element-aa27b26f-0686-4c29-98c5-8217044045b7/ww-config.js';
import wwobjecte5e2f36738d341fca9387d221dd4691b from '@/components/elements/element-e5e2f367-38d3-41fc-a938-7d221dd4691b/ww-config.js';
import wwobject8aaf365113514aea8b385d10ebc7fb69 from '@/components/elements/element-8aaf3651-1351-4aea-8b38-5d10ebc7fb69/ww-config.js';
import wwobject53401515b6944c79a88dabeecb1de562 from '@/components/elements/element-53401515-b694-4c79-a88d-abeecb1de562/ww-config.js';
import wwobjectc8199d0db61f464098e0c4be9ea254e0 from '@/components/elements/element-c8199d0d-b61f-4640-98e0-c4be9ea254e0/ww-config.js';
import wwobject335e0457263543089979ddf7e8e81d53 from '@/components/elements/element-335e0457-2635-4308-9979-ddf7e8e81d53/ww-config.js';
import wwobject0489cac7a0944607b9f0bb793693d021 from '@/components/elements/element-0489cac7-a094-4607-b9f0-bb793693d021/ww-config.js';
import wwobject57831abf83ad49adba973bd30b035710 from '@/components/elements/element-57831abf-83ad-49ad-ba97-3bd30b035710/ww-config.js';
import wwobjecta6cb6a4d6af74cd6b530a15d9ec64488 from '@/components/elements/element-a6cb6a4d-6af7-4cd6-b530-a15d9ec64488/ww-config.js';
import wwobject9ae1fce82e314bfda4d20450235bdfd5 from '@/components/elements/element-9ae1fce8-2e31-4bfd-a4d2-0450235bdfd5/ww-config.js';
import wwobjectc6c0c00e49fd4cb9bd785bc09945721e from '@/components/elements/element-c6c0c00e-49fd-4cb9-bd78-5bc09945721e/ww-config.js';
import wwobjectaa29a66107ce484e8abb456186211282 from '@/components/elements/element-aa29a661-07ce-484e-8abb-456186211282/ww-config.js';
import wwobject6493af5395544833a58e35db0dd87ea2 from '@/components/elements/element-6493af53-9554-4833-a58e-35db0dd87ea2/ww-config.js';
import wwobject2d18ef4ce9e54dc6a29d01d9f797be5e from '@/components/elements/element-2d18ef4c-e9e5-4dc6-a29d-01d9f797be5e/ww-config.js';
import wwobject9ecb2cfccef74be8b7363e17a3b7e9ff from '@/components/elements/element-9ecb2cfc-cef7-4be8-b736-3e17a3b7e9ff/ww-config.js';
import wwobject6145eb600af84e52bcc6dc0f6743654e from '@/components/elements/element-6145eb60-0af8-4e52-bcc6-dc0f6743654e/ww-config.js';
import wwobjectb783dc65d5284f748c14e27c934c39b1 from '@/components/elements/element-b783dc65-d528-4f74-8c14-e27c934c39b1/ww-config.js';
import wwobject1b1e21739b7842cca8eea6167caea340 from '@/components/elements/element-1b1e2173-9b78-42cc-a8ee-a6167caea340/ww-config.js';
import wwobjectfb3e0024f0174193a6a1bc2eed330d1d from '@/components/elements/element-fb3e0024-f017-4193-a6a1-bc2eed330d1d/ww-config.js';
import wwobject4bbea6da38034029a6a1d7f9296a9cec from '@/components/elements/element-4bbea6da-3803-4029-a6a1-d7f9296a9cec/ww-config.js';
import wwobjecte2962a2203b34421b85e906177d2303f from '@/components/elements/element-e2962a22-03b3-4421-b85e-906177d2303f/ww-config.js';
import wwobjectdeb10a015eef4aa190171b51c2ad6fd0 from '@/components/elements/element-deb10a01-5eef-4aa1-9017-1b51c2ad6fd0/ww-config.js';
import wwobjectd7904e9dfc9a4d809e32728e097879ad from '@/components/elements/element-d7904e9d-fc9a-4d80-9e32-728e097879ad/ww-config.js';
import wwobject2f6c2a52936048bbbc849676e78a6362 from '@/components/elements/element-2f6c2a52-9360-48bb-bc84-9676e78a6362/ww-config.js';
import wwobject7dc3f25e7eb7468899e2e00aa81bdbad from '@/components/elements/element-7dc3f25e-7eb7-4688-99e2-e00aa81bdbad/ww-config.js';
import wwobject985570fcb3c04566800482ab3b30a11d from '@/components/elements/element-985570fc-b3c0-4566-8004-82ab3b30a11d/ww-config.js';
import wwobject9ccf84b0e5424423869fb4828301ec49 from '@/components/elements/element-9ccf84b0-e542-4423-869f-b4828301ec49/ww-config.js';
import wwobject27437c6de8d34f40a20b8320b88dd427 from '@/components/elements/element-27437c6d-e8d3-4f40-a20b-8320b88dd427/ww-config.js';
import wwobject2a3586d4d9eb420f858ce43e192fccfa from '@/components/elements/element-2a3586d4-d9eb-420f-858c-e43e192fccfa/ww-config.js';
import wwobject73a13effbdc74021bdc6413c97fe91c1 from '@/components/elements/element-73a13eff-bdc7-4021-bdc6-413c97fe91c1/ww-config.js';
import wwobject640901ca1d5e4dd7b28fce8bd5be5b8c from '@/components/elements/element-640901ca-1d5e-4dd7-b28f-ce8bd5be5b8c/ww-config.js';
import wwobject1676cb764bae4b6fa0d2329e0eb260a4 from '@/components/elements/element-1676cb76-4bae-4b6f-a0d2-329e0eb260a4/ww-config.js';
import wwobject5c603ed1b44840008e15855b111302b7 from '@/components/elements/element-5c603ed1-b448-4000-8e15-855b111302b7/ww-config.js';
import wwobject61825dc396de46e1a8c4b091289d8448 from '@/components/elements/element-61825dc3-96de-46e1-a8c4-b091289d8448/ww-config.js';
/* wwFront:end */

export const useComponentBasesStore = defineStore('componentBases', () => {
    let configurations;
    /* wwFront:start */
    // eslint-disable-next-line no-undef
    configurations = {'plugin-cabb43dd-6161-4140-8ebf-03b6fb045a0b': getInheritedConfiguration({ ...plugincabb43dd616141408ebf03b6fb045a0b, name: 'plugin-cabb43dd-6161-4140-8ebf-03b6fb045a0b' }),
'plugin-8bc1b5c9-29e4-4269-becb-a2e1a8de9127': getInheritedConfiguration({ ...plugin8bc1b5c929e44269becba2e1a8de9127, name: 'plugin-8bc1b5c9-29e4-4269-becb-a2e1a8de9127' }),
'plugin-832d6f7a-42c3-43f1-a3ce-9a678272f811': getInheritedConfiguration({ ...plugin832d6f7a42c343f1a3ce9a678272f811, name: 'plugin-832d6f7a-42c3-43f1-a3ce-9a678272f811' }),
'plugin-41448d5d-ae26-49bd-82b6-1c79f462e972': getInheritedConfiguration({ ...plugin41448d5dae2649bd82b61c79f462e972, name: 'plugin-41448d5d-ae26-49bd-82b6-1c79f462e972' }),
'plugin-01af5352-af71-4382-844b-2ec141ff243b': getInheritedConfiguration({ ...plugin01af5352af714382844b2ec141ff243b, name: 'plugin-01af5352-af71-4382-844b-2ec141ff243b' }),
'plugin-cd33cf33-e29f-4e8c-ac26-b997fe507ce7': getInheritedConfiguration({ ...plugincd33cf33e29f4e8cac26b997fe507ce7, name: 'plugin-cd33cf33-e29f-4e8c-ac26-b997fe507ce7' }),
'plugin-d66a250d-8468-469e-ad33-ee028f632398': getInheritedConfiguration({ ...plugind66a250d8468469ead33ee028f632398, name: 'plugin-d66a250d-8468-469e-ad33-ee028f632398' }),
'plugin-00d22f72-1a03-44f8-ad68-c593dc80b543': getInheritedConfiguration({ ...plugin00d22f721a0344f8ad68c593dc80b543, name: 'plugin-00d22f72-1a03-44f8-ad68-c593dc80b543' }),
'plugin-e93a2dfd-9b19-473e-b445-c666fed4e14a': getInheritedConfiguration({ ...plugine93a2dfd9b19473eb445c666fed4e14a, name: 'plugin-e93a2dfd-9b19-473e-b445-c666fed4e14a' }),
'plugin-f9ef41c3-1c53-4857-855b-f2f6a40b7186': getInheritedConfiguration({ ...pluginf9ef41c31c534857855bf2f6a40b7186, name: 'plugin-f9ef41c3-1c53-4857-855b-f2f6a40b7186' }),
'plugin-66a79c98-70e7-4bc4-8859-20776b024ec2': getInheritedConfiguration({ ...plugin66a79c9870e74bc4885920776b024ec2, name: 'plugin-66a79c98-70e7-4bc4-8859-20776b024ec2' }),
'plugin-97e7b1ae-f88a-4697-849c-ee56ab49bb48': getInheritedConfiguration({ ...plugin97e7b1aef88a4697849cee56ab49bb48, name: 'plugin-97e7b1ae-f88a-4697-849c-ee56ab49bb48' }),
'plugin-f5856798-485d-47be-b433-d43d771c64e1': getInheritedConfiguration({ ...pluginf5856798485d47beb433d43d771c64e1, name: 'plugin-f5856798-485d-47be-b433-d43d771c64e1' }),
'plugin-2bd1c688-31c5-443e-ae25-59aa5b6431fb': getInheritedConfiguration({ ...plugin2bd1c68831c5443eae2559aa5b6431fb, name: 'plugin-2bd1c688-31c5-443e-ae25-59aa5b6431fb' }),
'plugin-6a64802c-52f8-4637-9932-580bf178aaa7': getInheritedConfiguration({ ...plugin6a64802c52f846379932580bf178aaa7, name: 'plugin-6a64802c-52f8-4637-9932-580bf178aaa7' }),
'plugin-fbf0feec-356b-461b-8738-3b1f44edaf02': getInheritedConfiguration({ ...pluginfbf0feec356b461b87383b1f44edaf02, name: 'plugin-fbf0feec-356b-461b-8738-3b1f44edaf02' }),
'plugin-1506e088-e31c-49bc-83a1-90a3de4f6db1': getInheritedConfiguration({ ...plugin1506e088e31c49bc83a190a3de4f6db1, name: 'plugin-1506e088-e31c-49bc-83a1-90a3de4f6db1' }),
'plugin-75b9e021-a5fe-4ae9-8c6a-f4b3e65f2a24': getInheritedConfiguration({ ...plugin75b9e021a5fe4ae98c6af4b3e65f2a24, name: 'plugin-75b9e021-a5fe-4ae9-8c6a-f4b3e65f2a24' }),
'plugin-1c5f5c0f-5609-4031-9e57-5bb4811be7b3': getInheritedConfiguration({ ...plugin1c5f5c0f560940319e575bb4811be7b3, name: 'plugin-1c5f5c0f-5609-4031-9e57-5bb4811be7b3' }),
'plugin-60610cfd-fa28-4fc1-9e72-088b5c667e81': getInheritedConfiguration({ ...plugin60610cfdfa284fc19e72088b5c667e81, name: 'plugin-60610cfd-fa28-4fc1-9e72-088b5c667e81' }),
'plugin-d7d2c879-1783-4d58-a9bb-807f065d941e': getInheritedConfiguration({ ...plugind7d2c87917834d58a9bb807f065d941e, name: 'plugin-d7d2c879-1783-4d58-a9bb-807f065d941e' }),
'plugin-9c40819b-4a8f-468f-9ba5-4b9699f3361f': getInheritedConfiguration({ ...plugin9c40819b4a8f468f9ba54b9699f3361f, name: 'plugin-9c40819b-4a8f-468f-9ba5-4b9699f3361f' }),
'section-99586bd3-2b15-4d6b-a025-6a50d07ca845': getInheritedConfiguration({ ...section99586bd32b154d6ba0256a50d07ca845, name: 'section-99586bd3-2b15-4d6b-a025-6a50d07ca845' }),
'section-ef0ecc71-9a59-4eab-94b0-b36d66d3d61d': getInheritedConfiguration({ ...sectionef0ecc719a594eab94b0b36d66d3d61d, name: 'section-ef0ecc71-9a59-4eab-94b0-b36d66d3d61d' }),
'wwobject-f002c261-daa9-40cc-a7ca-f8f3621ea023': getInheritedConfiguration({ ...wwobjectf002c261daa940cca7caf8f3621ea023, name: 'wwobject-f002c261-daa9-40cc-a7ca-f8f3621ea023' }),
'wwobject-e4de0cd8-7324-47ee-a0c3-cf4114a9f952': getInheritedConfiguration({ ...wwobjecte4de0cd8732447eea0c3cf4114a9f952, name: 'wwobject-e4de0cd8-7324-47ee-a0c3-cf4114a9f952' }),
'wwobject-6408af41-4f19-48c7-822f-f2b543859711': getInheritedConfiguration({ ...wwobject6408af414f1948c7822ff2b543859711, name: 'wwobject-6408af41-4f19-48c7-822f-f2b543859711' }),
'wwobject-cf4a5d68-7d4d-465d-bfe6-91e2f0d9a359': getInheritedConfiguration({ ...wwobjectcf4a5d687d4d465dbfe691e2f0d9a359, name: 'wwobject-cf4a5d68-7d4d-465d-bfe6-91e2f0d9a359' }),
'wwobject-967a546c-d29c-490f-ae27-dbfc3e5f1359': getInheritedConfiguration({ ...wwobject967a546cd29c490fae27dbfc3e5f1359, name: 'wwobject-967a546c-d29c-490f-ae27-dbfc3e5f1359' }),
'wwobject-fba0c85a-feb7-4384-82fb-380b0276169a': getInheritedConfiguration({ ...wwobjectfba0c85afeb7438482fb380b0276169a, name: 'wwobject-fba0c85a-feb7-4384-82fb-380b0276169a' }),
'wwobject-b8e4146c-4fb2-421f-bf8c-2cc7e21254cd': getInheritedConfiguration({ ...wwobjectb8e4146c4fb2421fbf8c2cc7e21254cd, name: 'wwobject-b8e4146c-4fb2-421f-bf8c-2cc7e21254cd' }),
'wwobject-8bd1da25-2746-4314-80b9-4271ee6bd644': getInheritedConfiguration({ ...wwobject8bd1da252746431480b94271ee6bd644, name: 'wwobject-8bd1da25-2746-4314-80b9-4271ee6bd644' }),
'wwobject-5e1b9eca-9711-48f0-9de9-6610247cae37': getInheritedConfiguration({ ...wwobject5e1b9eca971148f09de96610247cae37, name: 'wwobject-5e1b9eca-9711-48f0-9de9-6610247cae37' }),
'wwobject-234b4566-98ac-49cd-915e-bb00aab2f5c5': getInheritedConfiguration({ ...wwobject234b456698ac49cd915ebb00aab2f5c5, name: 'wwobject-234b4566-98ac-49cd-915e-bb00aab2f5c5' }),
'wwobject-21881619-a984-4847-81a9-922c3dbb5853': getInheritedConfiguration({ ...wwobject21881619a984484781a9922c3dbb5853, name: 'wwobject-21881619-a984-4847-81a9-922c3dbb5853' }),
'wwobject-aeb78b9a-6fb6-4c49-931d-faedcfad67ba': getInheritedConfiguration({ ...wwobjectaeb78b9a6fb64c49931dfaedcfad67ba, name: 'wwobject-aeb78b9a-6fb6-4c49-931d-faedcfad67ba' }),
'wwobject-fd8c482f-532c-4aeb-a7ae-6904a6b62a1b': getInheritedConfiguration({ ...wwobjectfd8c482f532c4aeba7ae6904a6b62a1b, name: 'wwobject-fd8c482f-532c-4aeb-a7ae-6904a6b62a1b' }),
'wwobject-99ea5bf7-b91e-43ea-8ec3-dbaf2b171e34': getInheritedConfiguration({ ...wwobject99ea5bf7b91e43ea8ec3dbaf2b171e34, name: 'wwobject-99ea5bf7-b91e-43ea-8ec3-dbaf2b171e34' }),
'wwobject-0dc461bb-103e-4b2e-80e0-846ec3c30a6e': getInheritedConfiguration({ ...wwobject0dc461bb103e4b2e80e0846ec3c30a6e, name: 'wwobject-0dc461bb-103e-4b2e-80e0-846ec3c30a6e' }),
'wwobject-0d3e75d1-9e77-44cb-a272-8b0825fbc5da': getInheritedConfiguration({ ...wwobject0d3e75d19e7744cba2728b0825fbc5da, name: 'wwobject-0d3e75d1-9e77-44cb-a272-8b0825fbc5da' }),
'wwobject-69d0b3ef-b265-494c-8cd1-874da4aa1834': getInheritedConfiguration({ ...wwobject69d0b3efb265494c8cd1874da4aa1834, name: 'wwobject-69d0b3ef-b265-494c-8cd1-874da4aa1834' }),
'wwobject-6dee3327-9afa-4b44-bade-bdb547cdb18b': getInheritedConfiguration({ ...wwobject6dee33279afa4b44badebdb547cdb18b, name: 'wwobject-6dee3327-9afa-4b44-bade-bdb547cdb18b' }),
'wwobject-83d890fb-84f9-4386-b459-fb4be89a8e15': getInheritedConfiguration({ ...wwobject83d890fb84f94386b459fb4be89a8e15, name: 'wwobject-83d890fb-84f9-4386-b459-fb4be89a8e15' }),
'wwobject-6ba133b6-a444-414f-93a5-25cd237dd398': getInheritedConfiguration({ ...wwobject6ba133b6a444414f93a525cd237dd398, name: 'wwobject-6ba133b6-a444-414f-93a5-25cd237dd398' }),
'wwobject-af811adf-94d9-49dd-ab22-e2f29ae30299': getInheritedConfiguration({ ...wwobjectaf811adf94d949ddab22e2f29ae30299, name: 'wwobject-af811adf-94d9-49dd-ab22-e2f29ae30299' }),
'wwobject-6f8796b1-8273-498d-95fc-7013b7c63214': getInheritedConfiguration({ ...wwobject6f8796b18273498d95fc7013b7c63214, name: 'wwobject-6f8796b1-8273-498d-95fc-7013b7c63214' }),
'wwobject-88ef76b6-46d5-4685-878f-2f1fa0d54cb8': getInheritedConfiguration({ ...wwobject88ef76b646d54685878f2f1fa0d54cb8, name: 'wwobject-88ef76b6-46d5-4685-878f-2f1fa0d54cb8' }),
'wwobject-3a7d6379-12d3-4387-98ff-b332bb492a63': getInheritedConfiguration({ ...wwobject3a7d637912d3438798ffb332bb492a63, name: 'wwobject-3a7d6379-12d3-4387-98ff-b332bb492a63' }),
'wwobject-9256b033-f4e8-4ab4-adce-dac3a940d7f5': getInheritedConfiguration({ ...wwobject9256b033f4e84ab4adcedac3a940d7f5, name: 'wwobject-9256b033-f4e8-4ab4-adce-dac3a940d7f5' }),
'wwobject-1827b154-f2aa-4235-b3f5-1d2e19c4b6cc': getInheritedConfiguration({ ...wwobject1827b154f2aa4235b3f51d2e19c4b6cc, name: 'wwobject-1827b154-f2aa-4235-b3f5-1d2e19c4b6cc' }),
'wwobject-5a88036f-22ea-4f8d-b4a5-bc226ef95061': getInheritedConfiguration({ ...wwobject5a88036f22ea4f8db4a5bc226ef95061, name: 'wwobject-5a88036f-22ea-4f8d-b4a5-bc226ef95061' }),
'wwobject-6d692ca2-6cdc-4805-aa0c-211102f335d0': getInheritedConfiguration({ ...wwobject6d692ca26cdc4805aa0c211102f335d0, name: 'wwobject-6d692ca2-6cdc-4805-aa0c-211102f335d0' }),
'wwobject-70a53858-53ca-40a5-ad88-c1cd33b5cc9f': getInheritedConfiguration({ ...wwobject70a5385853ca40a5ad88c1cd33b5cc9f, name: 'wwobject-70a53858-53ca-40a5-ad88-c1cd33b5cc9f' }),
'wwobject-00df9115-50ec-4114-9a76-c96c76721e6f': getInheritedConfiguration({ ...wwobject00df911550ec41149a76c96c76721e6f, name: 'wwobject-00df9115-50ec-4114-9a76-c96c76721e6f' }),
'wwobject-59dca300-db78-42e4-a7a6-0cbf22d3cc82': getInheritedConfiguration({ ...wwobject59dca300db7842e4a7a60cbf22d3cc82, name: 'wwobject-59dca300-db78-42e4-a7a6-0cbf22d3cc82' }),
'wwobject-7179ba70-c5d7-49a5-9828-f85704fd1efc': getInheritedConfiguration({ ...wwobject7179ba70c5d749a59828f85704fd1efc, name: 'wwobject-7179ba70-c5d7-49a5-9828-f85704fd1efc' }),
'wwobject-3082cb3f-3033-4e6e-8222-1fba3af145fe': getInheritedConfiguration({ ...wwobject3082cb3f30334e6e82221fba3af145fe, name: 'wwobject-3082cb3f-3033-4e6e-8222-1fba3af145fe' }),
'wwobject-a823467c-bdc7-4cec-a38c-71875c4c214a': getInheritedConfiguration({ ...wwobjecta823467cbdc74ceca38c71875c4c214a, name: 'wwobject-a823467c-bdc7-4cec-a38c-71875c4c214a' }),
'wwobject-60676ae5-99b1-4278-9330-4299cd99c5cf': getInheritedConfiguration({ ...wwobject60676ae599b1427893304299cd99c5cf, name: 'wwobject-60676ae5-99b1-4278-9330-4299cd99c5cf' }),
'wwobject-2c8e3e54-3ea3-48ea-b8c8-e7580e3362a2': getInheritedConfiguration({ ...wwobject2c8e3e543ea348eab8c8e7580e3362a2, name: 'wwobject-2c8e3e54-3ea3-48ea-b8c8-e7580e3362a2' }),
'wwobject-1ba25bdf-dee9-4e0e-a0b8-b3f3128c3b65': getInheritedConfiguration({ ...wwobject1ba25bdfdee94e0ea0b8b3f3128c3b65, name: 'wwobject-1ba25bdf-dee9-4e0e-a0b8-b3f3128c3b65' }),
'wwobject-9202d35c-2813-45bc-a7f3-0adb85f83e5e': getInheritedConfiguration({ ...wwobject9202d35c281345bca7f30adb85f83e5e, name: 'wwobject-9202d35c-2813-45bc-a7f3-0adb85f83e5e' }),
'wwobject-97a63460-5c25-4d74-ac1f-86693c2e4a08': getInheritedConfiguration({ ...wwobject97a634605c254d74ac1f86693c2e4a08, name: 'wwobject-97a63460-5c25-4d74-ac1f-86693c2e4a08' }),
'wwobject-2fd375f8-f5c7-4d81-881d-dacd40bc0ad3': getInheritedConfiguration({ ...wwobject2fd375f8f5c74d81881ddacd40bc0ad3, name: 'wwobject-2fd375f8-f5c7-4d81-881d-dacd40bc0ad3' }),
'wwobject-f4c24d06-bc88-4b62-add3-4d1f8b42221c': getInheritedConfiguration({ ...wwobjectf4c24d06bc884b62add34d1f8b42221c, name: 'wwobject-f4c24d06-bc88-4b62-add3-4d1f8b42221c' }),
'wwobject-aa27b26f-0686-4c29-98c5-8217044045b7': getInheritedConfiguration({ ...wwobjectaa27b26f06864c2998c58217044045b7, name: 'wwobject-aa27b26f-0686-4c29-98c5-8217044045b7' }),
'wwobject-e5e2f367-38d3-41fc-a938-7d221dd4691b': getInheritedConfiguration({ ...wwobjecte5e2f36738d341fca9387d221dd4691b, name: 'wwobject-e5e2f367-38d3-41fc-a938-7d221dd4691b' }),
'wwobject-8aaf3651-1351-4aea-8b38-5d10ebc7fb69': getInheritedConfiguration({ ...wwobject8aaf365113514aea8b385d10ebc7fb69, name: 'wwobject-8aaf3651-1351-4aea-8b38-5d10ebc7fb69' }),
'wwobject-53401515-b694-4c79-a88d-abeecb1de562': getInheritedConfiguration({ ...wwobject53401515b6944c79a88dabeecb1de562, name: 'wwobject-53401515-b694-4c79-a88d-abeecb1de562' }),
'wwobject-c8199d0d-b61f-4640-98e0-c4be9ea254e0': getInheritedConfiguration({ ...wwobjectc8199d0db61f464098e0c4be9ea254e0, name: 'wwobject-c8199d0d-b61f-4640-98e0-c4be9ea254e0' }),
'wwobject-335e0457-2635-4308-9979-ddf7e8e81d53': getInheritedConfiguration({ ...wwobject335e0457263543089979ddf7e8e81d53, name: 'wwobject-335e0457-2635-4308-9979-ddf7e8e81d53' }),
'wwobject-0489cac7-a094-4607-b9f0-bb793693d021': getInheritedConfiguration({ ...wwobject0489cac7a0944607b9f0bb793693d021, name: 'wwobject-0489cac7-a094-4607-b9f0-bb793693d021' }),
'wwobject-57831abf-83ad-49ad-ba97-3bd30b035710': getInheritedConfiguration({ ...wwobject57831abf83ad49adba973bd30b035710, name: 'wwobject-57831abf-83ad-49ad-ba97-3bd30b035710' }),
'wwobject-a6cb6a4d-6af7-4cd6-b530-a15d9ec64488': getInheritedConfiguration({ ...wwobjecta6cb6a4d6af74cd6b530a15d9ec64488, name: 'wwobject-a6cb6a4d-6af7-4cd6-b530-a15d9ec64488' }),
'wwobject-9ae1fce8-2e31-4bfd-a4d2-0450235bdfd5': getInheritedConfiguration({ ...wwobject9ae1fce82e314bfda4d20450235bdfd5, name: 'wwobject-9ae1fce8-2e31-4bfd-a4d2-0450235bdfd5' }),
'wwobject-c6c0c00e-49fd-4cb9-bd78-5bc09945721e': getInheritedConfiguration({ ...wwobjectc6c0c00e49fd4cb9bd785bc09945721e, name: 'wwobject-c6c0c00e-49fd-4cb9-bd78-5bc09945721e' }),
'wwobject-aa29a661-07ce-484e-8abb-456186211282': getInheritedConfiguration({ ...wwobjectaa29a66107ce484e8abb456186211282, name: 'wwobject-aa29a661-07ce-484e-8abb-456186211282' }),
'wwobject-6493af53-9554-4833-a58e-35db0dd87ea2': getInheritedConfiguration({ ...wwobject6493af5395544833a58e35db0dd87ea2, name: 'wwobject-6493af53-9554-4833-a58e-35db0dd87ea2' }),
'wwobject-2d18ef4c-e9e5-4dc6-a29d-01d9f797be5e': getInheritedConfiguration({ ...wwobject2d18ef4ce9e54dc6a29d01d9f797be5e, name: 'wwobject-2d18ef4c-e9e5-4dc6-a29d-01d9f797be5e' }),
'wwobject-9ecb2cfc-cef7-4be8-b736-3e17a3b7e9ff': getInheritedConfiguration({ ...wwobject9ecb2cfccef74be8b7363e17a3b7e9ff, name: 'wwobject-9ecb2cfc-cef7-4be8-b736-3e17a3b7e9ff' }),
'wwobject-6145eb60-0af8-4e52-bcc6-dc0f6743654e': getInheritedConfiguration({ ...wwobject6145eb600af84e52bcc6dc0f6743654e, name: 'wwobject-6145eb60-0af8-4e52-bcc6-dc0f6743654e' }),
'wwobject-b783dc65-d528-4f74-8c14-e27c934c39b1': getInheritedConfiguration({ ...wwobjectb783dc65d5284f748c14e27c934c39b1, name: 'wwobject-b783dc65-d528-4f74-8c14-e27c934c39b1' }),
'wwobject-1b1e2173-9b78-42cc-a8ee-a6167caea340': getInheritedConfiguration({ ...wwobject1b1e21739b7842cca8eea6167caea340, name: 'wwobject-1b1e2173-9b78-42cc-a8ee-a6167caea340' }),
'wwobject-fb3e0024-f017-4193-a6a1-bc2eed330d1d': getInheritedConfiguration({ ...wwobjectfb3e0024f0174193a6a1bc2eed330d1d, name: 'wwobject-fb3e0024-f017-4193-a6a1-bc2eed330d1d' }),
'wwobject-4bbea6da-3803-4029-a6a1-d7f9296a9cec': getInheritedConfiguration({ ...wwobject4bbea6da38034029a6a1d7f9296a9cec, name: 'wwobject-4bbea6da-3803-4029-a6a1-d7f9296a9cec' }),
'wwobject-e2962a22-03b3-4421-b85e-906177d2303f': getInheritedConfiguration({ ...wwobjecte2962a2203b34421b85e906177d2303f, name: 'wwobject-e2962a22-03b3-4421-b85e-906177d2303f' }),
'wwobject-deb10a01-5eef-4aa1-9017-1b51c2ad6fd0': getInheritedConfiguration({ ...wwobjectdeb10a015eef4aa190171b51c2ad6fd0, name: 'wwobject-deb10a01-5eef-4aa1-9017-1b51c2ad6fd0' }),
'wwobject-d7904e9d-fc9a-4d80-9e32-728e097879ad': getInheritedConfiguration({ ...wwobjectd7904e9dfc9a4d809e32728e097879ad, name: 'wwobject-d7904e9d-fc9a-4d80-9e32-728e097879ad' }),
'wwobject-2f6c2a52-9360-48bb-bc84-9676e78a6362': getInheritedConfiguration({ ...wwobject2f6c2a52936048bbbc849676e78a6362, name: 'wwobject-2f6c2a52-9360-48bb-bc84-9676e78a6362' }),
'wwobject-7dc3f25e-7eb7-4688-99e2-e00aa81bdbad': getInheritedConfiguration({ ...wwobject7dc3f25e7eb7468899e2e00aa81bdbad, name: 'wwobject-7dc3f25e-7eb7-4688-99e2-e00aa81bdbad' }),
'wwobject-985570fc-b3c0-4566-8004-82ab3b30a11d': getInheritedConfiguration({ ...wwobject985570fcb3c04566800482ab3b30a11d, name: 'wwobject-985570fc-b3c0-4566-8004-82ab3b30a11d' }),
'wwobject-9ccf84b0-e542-4423-869f-b4828301ec49': getInheritedConfiguration({ ...wwobject9ccf84b0e5424423869fb4828301ec49, name: 'wwobject-9ccf84b0-e542-4423-869f-b4828301ec49' }),
'wwobject-27437c6d-e8d3-4f40-a20b-8320b88dd427': getInheritedConfiguration({ ...wwobject27437c6de8d34f40a20b8320b88dd427, name: 'wwobject-27437c6d-e8d3-4f40-a20b-8320b88dd427' }),
'wwobject-2a3586d4-d9eb-420f-858c-e43e192fccfa': getInheritedConfiguration({ ...wwobject2a3586d4d9eb420f858ce43e192fccfa, name: 'wwobject-2a3586d4-d9eb-420f-858c-e43e192fccfa' }),
'wwobject-73a13eff-bdc7-4021-bdc6-413c97fe91c1': getInheritedConfiguration({ ...wwobject73a13effbdc74021bdc6413c97fe91c1, name: 'wwobject-73a13eff-bdc7-4021-bdc6-413c97fe91c1' }),
'wwobject-640901ca-1d5e-4dd7-b28f-ce8bd5be5b8c': getInheritedConfiguration({ ...wwobject640901ca1d5e4dd7b28fce8bd5be5b8c, name: 'wwobject-640901ca-1d5e-4dd7-b28f-ce8bd5be5b8c' }),
'wwobject-1676cb76-4bae-4b6f-a0d2-329e0eb260a4': getInheritedConfiguration({ ...wwobject1676cb764bae4b6fa0d2329e0eb260a4, name: 'wwobject-1676cb76-4bae-4b6f-a0d2-329e0eb260a4' }),
'wwobject-5c603ed1-b448-4000-8e15-855b111302b7': getInheritedConfiguration({ ...wwobject5c603ed1b44840008e15855b111302b7, name: 'wwobject-5c603ed1-b448-4000-8e15-855b111302b7' }),
'wwobject-61825dc3-96de-46e1-a8c4-b091289d8448': getInheritedConfiguration({ ...wwobject61825dc396de46e1a8c4b091289d8448, name: 'wwobject-61825dc3-96de-46e1-a8c4-b091289d8448' })};
    /* wwFront:end */
 
    return {
        configurations,
     };
});
