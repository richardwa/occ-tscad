import { h, Signal } from "solid-vanilla";

export const Title = (s: string) =>
  h("div").css("font-weight", "bold").css("margin", "0.25rem").inner(s);

export const Panel = () =>
  h("div")
    .css("border-radius", "5px")
    .css("padding", "0.5rem")
    .css("background-color", "#424242");

export const Button = () =>
  h("button")
    .attr("type", "button")
    .css("padding", "0.25rem")
    .css("cursor", "pointer");

export const NavLink = (href: string) =>
  h("a").attr("href", href).attr("target", "_blank");

export const ClickLink = () =>
  h("a").css("cursor", "pointer").css("color", "blue");

export const TextArea = (val: Signal<string | undefined>) =>
  h("textarea")
    .watch(
      val,
      (node) => ((node.el as HTMLTextAreaElement).value = val.get() ?? ""),
    )
    .on("change", (event) => val.set(event.target.value));

export const TextInput = (val: Signal<string | undefined>) =>
  h("input")
    .attr("type", "text")
    .watch(
      val,
      (node) => ((node.el as HTMLInputElement).value = val.get() ?? ""),
    )
    .on("change", (event) => val.set(event.target.value));

export const NumberInput = (val: Signal<number>) =>
  h("input")
    .attr("type", "number")
    .attr("value", () => `${val}`)
    .on("change", (event) => val.set(event.target.value));

export const CheckBox = (val: Signal<boolean>) =>
  h("input")
    .attr("type", "checkbox")
    .attr("checked", () => (val.get() ? "checked" : null))
    .on("change", (event) => {
      val.set(event.target.checked);
    });
