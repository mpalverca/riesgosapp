import { MenuItem, TextField } from "@mui/material";

const TextInput = ({
  name,
  label,
  type,
  type = "text",
  options = [],
  props = {},
  fixData,
}) => {
  return (
    <TextField
      name={name}
      label={label}
      type={type}
      value={fixData || ""}
      onChange={handleChange}
      select={type === "select"}
      multiline={type === "textarea"}
      rows={type === "textarea" ? 5 : undefined}
      fullWidth
      disabled={name === "by" || name === "ubi"}
      {...props}
    >
      {type === "select" &&
        options.map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>
            {opt.label}
          </MenuItem>
        ))}
    </TextField>
  );
};

export default TextInput;
