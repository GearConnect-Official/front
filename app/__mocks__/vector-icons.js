import React from "react";

export const FontAwesome = ({ name, size, color }) => {
  return React.createElement("Icon", { name, size, color });
};

// Tu peux aussi mocker d'autres familles si besoin (MaterialIcons, Ionicons, etc.)
