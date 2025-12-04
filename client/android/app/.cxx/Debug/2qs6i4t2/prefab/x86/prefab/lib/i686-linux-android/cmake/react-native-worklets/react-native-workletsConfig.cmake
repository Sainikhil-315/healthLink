if(NOT TARGET react-native-worklets::worklets)
add_library(react-native-worklets::worklets SHARED IMPORTED)
set_target_properties(react-native-worklets::worklets PROPERTIES
    IMPORTED_LOCATION "D:/MERN/MindSprint-2k25/client/node_modules/react-native-worklets/android/build/intermediates/cxx/Debug/5vv4u1n3/obj/x86/libworklets.so"
    INTERFACE_INCLUDE_DIRECTORIES "D:/MERN/MindSprint-2k25/client/node_modules/react-native-worklets/android/build/prefab-headers/worklets"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

